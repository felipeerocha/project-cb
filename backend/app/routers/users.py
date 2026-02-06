from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.schemas import UserCreate, UserResponse, UserUpdate, PaginatedUser
from app.api.deps import get_current_user, get_current_active_superuser

router = APIRouter()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
):
    user_exists = db.query(User).filter(User.email == user_in.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado.")

    new_user = User(
        nome=user_in.nome,
        email=user_in.email,
        telefone=user_in.telefone,
        is_superuser=user_in.is_superuser,
        senha_hash=get_password_hash(user_in.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/", response_model=PaginatedUser)
def read_users(
    page: int = 1,
    limit: int = 100,
    q: Optional[str] = None,
    sort: Optional[str] = "nome",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
):
    query = db.query(User)

    if q:
        search = f"%{q}%"
        query = query.filter(or_(User.nome.ilike(search), User.email.ilike(search)))

    if sort:
        direction = desc if sort.startswith("-") else asc
        field_name = sort.lstrip("-")

        if hasattr(User, field_name):
            field = getattr(User, field_name)
            query = query.order_by(direction(field))

    total_registros = query.count()

    skip = (page - 1) * limit
    users = query.offset(skip).limit(limit).all()

    return {"total": total_registros, "page": page, "limit": limit, "data": users}


@router.get("/{user_id}", response_model=UserResponse)
def read_user_by_id(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_superuser and current_user.id != user_id:
        raise HTTPException(
            status_code=403, detail="Você não tem permissão para ver este usuário."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if user_in.nome is not None:
        user.nome = user_in.nome
    if user_in.email is not None:
        email_exists = db.query(User).filter(User.email == user_in.email).first()
        if email_exists and email_exists.id != user_id:
            raise HTTPException(status_code=400, detail="Este e-mail já está em uso.")
        user.email = user_in.email
    if user_in.telefone is not None:
        user.telefone = user_in.telefone
    if user_in.is_superuser is not None:
        user.is_superuser = user_in.is_superuser
    if user_in.password is not None:
        user.senha_hash = get_password_hash(user_in.password)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_superuser),
):
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400, detail="Você não pode deletar sua própria conta."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(user)
    db.commit()
    return None
