from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.core.database import get_db
from app.models.reserva import Reserva, StatusReserva
from app.schemas.schemas import (
    ReservaCreate,
    ReservaResponse,
    ReservaUpdateStatus,
    ReservaUpdate,
    PaginatedReserva,
)
from app.api.deps import get_current_user, get_current_active_superuser
from app.models.user import User

router = APIRouter()


@router.post("/", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def create_reserva(
    reserva_in: ReservaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_user_id = (
        reserva_in.user_id
        if (current_user.is_superuser and reserva_in.user_id)
        else current_user.id
    )

    nova_reserva = Reserva(
        user_id=target_user_id,
        unidade_id=reserva_in.unidade_id,
        data_reserva=reserva_in.data_reserva,
        horario_reserva=reserva_in.horario_reserva,
        qtd_pessoas=reserva_in.qtd_pessoas,
        itens_cardapio=reserva_in.itens_cardapio,
        status=StatusReserva.EM_ANALISE,
    )
    db.add(nova_reserva)
    db.commit()
    db.refresh(nova_reserva)
    return nova_reserva


@router.get("/", response_model=PaginatedReserva)
def list_reservas(
    page: int = 1,
    limit: int = 100,
    status: Optional[str] = None,
    sort: Optional[str] = "-data_reserva",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Reserva)

    if not current_user.is_superuser:
        query = query.filter(Reserva.user_id == current_user.id)

    if status:
        try:
            status_enum = StatusReserva(status.upper())
            query = query.filter(Reserva.status == status_enum)
        except ValueError:
            pass

    if sort:
        direction = desc if sort.startswith("-") else asc
        field_name = sort.lstrip("-")
        if hasattr(Reserva, field_name):
            field = getattr(Reserva, field_name)
            query = query.order_by(direction(field))

    total_registros = query.count()

    skip = (page - 1) * limit
    registros = query.offset(skip).limit(limit).all()

    return {"total": total_registros, "page": page, "limit": limit, "data": registros}


@router.get("/{reserva_id}", response_model=ReservaResponse)
def read_reserva(
    reserva_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")

    if not current_user.is_superuser and reserva.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    return reserva


@router.patch("/{reserva_id}/status", response_model=ReservaResponse)
def update_status_reserva(
    reserva_id: UUID,
    status_in: ReservaUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")

    reserva.status = status_in.status
    if status_in.motivo_reprovacao:
        reserva.motivo_reprovacao = status_in.motivo_reprovacao

    db.commit()
    db.refresh(reserva)
    return reserva


@router.patch("/{reserva_id}", response_model=ReservaResponse)
def update_reserva_data(
    reserva_id: UUID,
    reserva_in: ReservaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")

    if not current_user.is_superuser and reserva.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    if not current_user.is_superuser and reserva.status != StatusReserva.EM_ANALISE:
        raise HTTPException(
            status_code=400, detail="Não é possível editar uma reserva já finalizada."
        )

    if reserva_in.data_reserva:
        reserva.data_reserva = reserva_in.data_reserva
    if reserva_in.qtd_pessoas:
        reserva.qtd_pessoas = reserva_in.qtd_pessoas

    if reserva_in.itens_cardapio is not None:
        reserva.itens_cardapio = reserva_in.itens_cardapio

    db.commit()
    db.refresh(reserva)
    return reserva


@router.delete("/{reserva_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reserva(
    reserva_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reserva = db.query(Reserva).filter(Reserva.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")

    if not current_user.is_superuser and reserva.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    db.delete(reserva)
    db.commit()
    return None
