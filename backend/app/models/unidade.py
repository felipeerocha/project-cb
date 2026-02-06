import uuid
from sqlalchemy import Column, String, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base


class Unidade(Base):
    __tablename__ = "unidades"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    nome = Column(String, nullable=False)
    regiao = Column(String, nullable=False)
    cep = Column(String, nullable=False)
    endereco = Column(String, nullable=False)
    foto_url = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    reservas = relationship("Reserva", back_populates="unidade")
