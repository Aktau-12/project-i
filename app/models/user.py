from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.db import Base
from app.models.hero import UserHeroProgress, UserHeroStep

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    mbti_type = Column(String(32), nullable=True)
    archetype = Column(String(64), nullable=True)
    xp = Column(Integer, default=0)

    # 🔗 Связи
    hero_progress = relationship(
        "UserHeroProgress",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    hero_step_progress = relationship(
        "UserHeroStep",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    results = relationship(
        "UserResult",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return (
            f"<User(id={self.id}, email={self.email}, name={self.name}, "
            f"created_at={self.created_at})>"
        )
