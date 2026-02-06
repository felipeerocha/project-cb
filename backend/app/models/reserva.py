import uuid
import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class StatusReserva(str, enum.Enum):
    EM_ANALISE = "EM_ANALISE"
    APROVADO = "APROVADO"
    REPROVADO = "REPROVADO"


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    data_reserva = Column(DateTime, nullable=False)
    qtd_pessoas = Column(Integer, nullable=False)
    horario_reserva = Column(String, nullable=False)
    itens_cardapio = Column(JSON, nullable=True)
    status = Column(Enum(StatusReserva), default=StatusReserva.EM_ANALISE)
    motivo_reprovacao = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    unidade_id = Column(UUID(as_uuid=True), ForeignKey("unidades.id"))

    usuario = relationship("User", back_populates="reservas")
    unidade = relationship("Unidade", back_populates="reservas")
