from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os
from pathlib import Path

# 🔄 Загружаем переменные окружения из .env
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# 📄 Берем строку подключения к БД из .env
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 🚀 Создаём движок SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 🛠 Создаём сессию
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🧱 Базовый класс для моделей
Base = declarative_base()

# ✅ Функция-зависимость для подключения к БД
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
