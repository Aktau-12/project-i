from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from app.database.db import SessionLocal
from app.models.user import User
from app.models.hero import UserHeroProgress
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path
import os

# 🔄 Загружаем .env
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# 🔐 JWT конфигурация
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))

if not SECRET_KEY:
    raise RuntimeError("❌ SECRET_KEY не найден в .env")

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Pydantic-модели
class UserCreate(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Утилиты для паролей
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Генерация токена
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Работа с БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Получение текущего пользователя
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="⛔️ Недопустимый токен")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="⛔️ Невозможно декодировать токен")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="⛔️ Пользователь не найден")
    return user

# 🔐 Регистрация нового пользователя
@router.post("/register")
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # 1) Проверяем, что email ещё не занят
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="⛔️ Пользователь с таким email уже зарегистрирован"
        )

    # 2) Хешируем пароль и готовим объекты
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        xp=0
    )
    db.add(new_user)
    hero_progress = UserHeroProgress(
        user_id=new_user.id,
        xp=0
    )
    db.add(hero_progress)

    # 3) Пишем в БД и обрабатываем дубликаты
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="⛔️ Пользователь с таким email уже зарегистрирован"
        )

    # 4) Освежаем и генерируем токен
    db.refresh(new_user)
    token = create_access_token(data={"sub": new_user.email})
    return {
        "message": "✅ Пользователь успешно зарегистрирован!",
        "access_token": token,
        "token_type": "bearer"
    }

# 🔐 Логин
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="⛔️ Неверный логин или пароль"
        )
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# 🔐 Тест защищённого маршрута
@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Привет, {current_user.name}! 🔐 Это защищённый маршрут."}
