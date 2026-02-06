import pytest
from app.models.user import User
from app.core.security import get_password_hash


@pytest.fixture
def admin_token(client, db_session):
    admin = User(
        nome="CB Test",
        email="test@cocobambu.com",
        senha_hash=get_password_hash("123"),
        is_superuser=True,
        telefone="00000000",
    )
    db_session.add(admin)
    db_session.commit()

    resp = client.post(
        "/auth/login", json={"email": "test@cocobambu.com", "password": "123"}
    )
    return resp.json()["access_token"]


@pytest.fixture
def user_token(client, admin_token):
    client.post(
        "/users/",
        json={
            "nome": "User",
            "email": "user@test.com",
            "password": "123",
            "is_superuser": False,
            "telefone": "00000000",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    resp = client.post(
        "/auth/login", json={"email": "user@test.com", "password": "123"}
    )
    return resp.json()["access_token"]


@pytest.fixture
def unidade_id(client, admin_token):
    resp = client.post(
        "/unidades/",
        json={
            "nome": "Unidade Teste",
            "regiao": "Sul",
            "endereco": "Rua X",
            "cep": "00000-000",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    return resp.json()["id"]


# --- CENÁRIOS DE TESTE ---


def test_login_wrong_credentials(client):
    resp = client.post(
        "/auth/login", json={"email": "errado@test.com", "password": "123"}
    )
    assert resp.status_code == 401
    assert resp.json()["detail"] == "Email ou senha incorretos"


def test_create_user_duplicate_email(client, admin_token):
    client.post(
        "/users/",
        json={
            "nome": "U1",
            "email": "dup@test.com",
            "password": "123",
            "is_superuser": False,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    resp = client.post(
        "/users/",
        json={
            "nome": "U2",
            "email": "dup@test.com",
            "password": "123",
            "is_superuser": False,
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 400
    assert "já está cadastrado" in resp.json()["detail"]


def test_delete_self_account(client, admin_token):
    me = client.get(
        "/users/me", headers={"Authorization": f"Bearer {admin_token}"}
    ).json()
    resp = client.delete(
        f"/users/{me['id']}", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert resp.status_code == 400
    assert "não pode deletar sua própria conta" in resp.json()["detail"]


def test_create_unidade_permission(client, user_token):
    """Usuário comum NÃO pode criar unidade"""
    resp = client.post(
        "/unidades/",
        json={"nome": "Hacker Unit", "regiao": "X", "endereco": "Y", "cep": "000"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert resp.status_code == 400


def test_delete_unidade_with_pending_reserva(
    client, admin_token, user_token, unidade_id
):
    """Não pode deletar unidade se tiver reserva em análise"""
    client.post(
        "/reservas/",
        json={
            "unidade_id": unidade_id,
            "data_reserva": "2026-12-31",
            "horario_reserva": "20:00",
            "qtd_pessoas": 2,
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )

    resp = client.delete(
        f"/unidades/{unidade_id}", headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert resp.status_code == 400
    assert (
        "Não é possível excluir uma unidade que possui reservas 'Em Análise'"
        in resp.json()["detail"]
    )


def test_user_cannot_edit_approved_reserva(client, admin_token, user_token, unidade_id):
    """Usuário comum não pode editar reserva se ela já foi APROVADA"""
    create_resp = client.post(
        "/reservas/",
        json={
            "unidade_id": unidade_id,
            "data_reserva": "2026-12-31",
            "horario_reserva": "20:00",
            "qtd_pessoas": 2,
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )
    reserva_id = create_resp.json()["id"]

    client.patch(
        f"/reservas/{reserva_id}/status",
        json={"status": "APROVADO"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    resp = client.patch(
        f"/reservas/{reserva_id}",
        json={"data_reserva": "2027-01-01"},
        headers={"Authorization": f"Bearer {user_token}"},
    )

    assert resp.status_code == 400
    assert "Não é possível editar uma reserva já finalizada" in resp.json()["detail"]


def test_admin_can_edit_any_reserva(client, admin_token, user_token, unidade_id):
    """Admin DEVE poder editar reserva mesmo aprovada"""
    create_resp = client.post(
        "/reservas/",
        json={
            "unidade_id": unidade_id,
            "data_reserva": "2026-12-31",
            "horario_reserva": "20:00",
            "qtd_pessoas": 2,
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )
    reserva_id = create_resp.json()["id"]

    client.patch(
        f"/reservas/{reserva_id}/status",
        json={"status": "APROVADO"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    resp = client.patch(
        f"/reservas/{reserva_id}",
        json={"qtd_pessoas": 100},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["qtd_pessoas"] == 100
