from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database.db import SessionLocal
from app.models.user import User
from app.models.hero import UserHeroProgress  # ✅ Прогресс героя
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

class UserCreate(BaseModel):
    email: str
    password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="⛔ Недопустимый токен")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="⛔ Невозможно декодировать токен")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="⛔ Пользователь не найден")
    return user

# 🔐 Регистрация нового пользователя
@router.post("/register")
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="⛔ Пользователь уже существует")

    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.email,
        xp=0  # ✅ Вот тут XP остаётся у User
    )
    db.add(new_user)
    db.flush()  # Получаем ID нового пользователя

    # ✅ И ещё создаём прогресс героя с XP = 0
    hero_progress = UserHeroProgress(
        user_id=new_user.id,
        xp=0
    )
    db.add(hero_progress)
    db.commit()
    db.refresh(new_user)

    return {"message": "✅ Пользователь успешно зарегистрирован!"}

# 🔐 Логин
@router.post("/login")
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="⛔ Неверный логин или пароль")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# 🔐 Тест защищённого маршрута
@router.get("/protected")
def protected_route(user: User = Depends(get_current_user)):
    return {"message": f"Привет, {user.name}! 🔐 Это защищённый маршрут."}
