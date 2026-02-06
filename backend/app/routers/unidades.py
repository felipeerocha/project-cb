from typing import List, Optional
import shutil
import uuid
import os
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.core.database import get_db
from app.models.unidade import Unidade
from app.schemas.schemas import (
    UnidadeCreate,
    UnidadeResponse,
    UnidadeUpdate,
    PaginatedUnidade,
)
from app.api.deps import get_current_active_superuser, get_current_user
from app.models.reserva import Reserva, StatusReserva

router = APIRouter()


@router.post("/", response_model=UnidadeResponse, status_code=status.HTTP_201_CREATED)
def create_unidade(
    unidade_in: UnidadeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    unidade = Unidade(**unidade_in.dict())
    db.add(unidade)
    db.commit()
    db.refresh(unidade)
    return unidade


@router.get("/", response_model=PaginatedUnidade)
def read_unidades(
    page: int = 1,  # Mudamos de skip para page (mais intuitivo)
    limit: int = 10,
    q: Optional[str] = None,
    sort: Optional[str] = "nome",  # Ex: "nome" ou "-nome"
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(Unidade)

    if q:
        query = query.filter(Unidade.nome.ilike(f"%{q}%"))

    total_registros = query.count()

    if sort:
        direction = desc if sort.startswith("-") else asc
        field_name = sort.lstrip("-")
        if hasattr(Unidade, field_name):
            field = getattr(Unidade, field_name)
            query = query.order_by(direction(field))

    skip = (page - 1) * limit
    registros = query.offset(skip).limit(limit).all()

    return {"total": total_registros, "page": page, "limit": limit, "data": registros}


@router.get("/{unidade_id}", response_model=UnidadeResponse)
def read_unidade(
    unidade_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    unidade = db.query(Unidade).filter(Unidade.id == unidade_id).first()
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    return unidade


@router.patch("/{unidade_id}", response_model=UnidadeResponse)
def update_unidade(
    unidade_id: UUID,
    unidade_in: UnidadeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    unidade = db.query(Unidade).filter(Unidade.id == unidade_id).first()
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")

    update_data = unidade_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(unidade, key, value)

    db.commit()
    db.refresh(unidade)
    return unidade


@router.post("/upload")
def upload_arquivo(
    file: UploadFile = File(...), current_user=Depends(get_current_active_superuser)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, detail="Arquivo deve ser uma imagem")

    os.makedirs("uploads", exist_ok=True)

    extensao = file.filename.split(".")[-1]
    novo_nome = f"{uuid.uuid4()}.{extensao}"
    caminho_arquivo = f"uploads/{novo_nome}"

    try:
        with open(caminho_arquivo, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(500, detail=f"Erro ao salvar arquivo: {str(e)}")

    return {"url": f"/uploads/{novo_nome}"}


@router.delete("/{unidade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unidade(
    unidade_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    unidade = db.query(Unidade).filter(Unidade.id == unidade_id).first()
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")

    reserva_pendente = (
        db.query(Reserva)
        .filter(
            Reserva.unidade_id == unidade_id, Reserva.status == StatusReserva.EM_ANALISE
        )
        .first()
    )

    if reserva_pendente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível excluir uma unidade que possui reservas 'Em Análise'. Aprove ou Reprove as reservas antes.",
        )

    db.query(Reserva).filter(Reserva.unidade_id == unidade_id).delete()

    db.delete(unidade)
    db.commit()

    return None
