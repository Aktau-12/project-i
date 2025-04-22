from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.user import UserResponse  # ✅ импорт схемы ответа

router = APIRouter(tags=["Users"])

# 🔌 Получение сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 👤 Получение текущего пользователя
@router.get("/users/me", response_model=UserResponse)
def get_user_me(user: User = Depends(get_current_user)):
    return user
