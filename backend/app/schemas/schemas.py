from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from enum import Enum


class StatusReservaEnum(str, Enum):
    EM_ANALISE = "EM_ANALISE"
    APROVADO = "APROVADO"
    REPROVADO = "REPROVADO"


class UserBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    is_superuser: bool = False


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    password: Optional[str] = None
    is_superuser: Optional[bool] = None


class UserResponse(UserBase):
    id: UUID

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UnidadeBase(BaseModel):
    nome: str
    regiao: str
    endereco: str
    cep: str
    foto_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UnidadeCreate(UnidadeBase):
    pass


class UnidadeUpdate(BaseModel):
    nome: Optional[str] = None
    regiao: Optional[str] = None
    cep: Optional[str] = None
    endereco: Optional[str] = None
    foto_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class UnidadeResponse(UnidadeBase):
    id: UUID

    class Config:
        from_attributes = True


class ItensCardapio(BaseModel):
    entrada: str
    prato_principal: str
    sobremesa: str


class ReservaBase(BaseModel):
    unidade_id: UUID
    data_reserva: datetime
    horario_reserva: str
    qtd_pessoas: int
    itens_cardapio: List[str] = Field(default_factory=list)


class ReservaCreate(ReservaBase):

    user_id: Optional[UUID] = None


class ReservaUpdate(BaseModel):
    data_reserva: Optional[datetime] = None
    horario_reserva: Optional[str] = None
    qtd_pessoas: Optional[int] = None
    itens_cardapio: Optional[List[str]] = None


class ReservaUpdateStatus(BaseModel):
    status: StatusReservaEnum
    motivo_reprovacao: Optional[str] = None


class ReservaResponse(ReservaBase):
    id: UUID
    user_id: UUID
    status: StatusReservaEnum
    motivo_reprovacao: Optional[str] = None
    created_at: datetime

    unidade: Optional[UnidadeResponse] = None
    usuario: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class PaginatedUnidade(BaseModel):
    total: int
    page: int
    limit: int
    data: List[UnidadeResponse]


class PaginatedReserva(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ReservaResponse]


class PaginatedUser(BaseModel):
    total: int
    page: int
    limit: int
    data: List[UserResponse]
