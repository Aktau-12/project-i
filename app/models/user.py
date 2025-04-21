from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base
from app.models.hero import UserHeroProgress, UserHeroStep

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=True)
    # Автоматически ставим текущее время на клиенте и на сервере
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        server_default=func.now(),
        nullable=False
    )
    mbti_type = Column(String, nullable=True)
    archetype = Column(String, nullable=True)
    xp = Column(Integer, default=0)

    # Один-к-одному: XP (связь с UserHeroProgress)
    hero_progress = relationship(UserHeroProgress, back_populates="user", uselist=False)

    # Один-ко-многим: шаги пути героя
    hero_step_progress = relationship(UserHeroStep, back_populates="user")

    results = relationship("UserResult", back_populates="user")

    def __repr__(self):
        return (
            f"<User(id={self.id}, email={self.email}, name={self.name}, "
            f"created_at={self.created_at})>"
        )
