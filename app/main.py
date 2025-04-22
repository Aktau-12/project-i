from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# 📦 Загружаем переменные окружения заранее
load_dotenv()

# 🕒 Импорт роутеров
from app.routes import (
    user,
    auth,
    test,
    coretalents,
    mbti,
    hero,
    rating,
    habit,
)

# 🚀 Создаём FastAPI-приложение
app = FastAPI(
    title="AI Profiler",
    description="🦱 Платформа для психологических тестов, саморазвития и AI‑помощи",
    version="1.0.0",
)

# 🌐 Настройки CORS

# Получаем список разрешённых источников из .env или по умолчанию
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

# Если ALLOWED_ORIGINS не задан, определяем автоматически по окружению
if not allowed_origins:
    environment = os.getenv("ENVIRONMENT", "development").lower()
    if environment == "production":
        allowed_origins = [
            "https://patient-happiness-production.up.railway.app",
            "https://lively-enjoyment-production.up.railway.app",
        ]
    else:
        allowed_origins = [
            "http://localhost:5173",
            "http://localhost:3000",
        ]

# ➡️ Применяем CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔐 Подключение роутеров
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(test.router, prefix="/tests", tags=["Tests"])
app.include_router(coretalents.router, prefix="/coretalents", tags=["CoreTalents"])
app.include_router(mbti.router, prefix="/mbti", tags=["MBTI"])
app.include_router(hero.router, prefix="/hero", tags=["Hero"])
app.include_router(rating.router, prefix="/rating", tags=["Rating"])
app.include_router(habit.router, prefix="/habits", tags=["Habits"])

# 🏠 Главная страница
@app.get("/", tags=["Root"])
def read_root() -> dict[str, str]:
    return {"message": "✅ AI Profiler успешно работает!"}

# 🚀 Эндпоинт для запуска миграций вручную
@app.get("/run-migrations", tags=["Migrations"])
async def run_migrations_from_api() -> dict[str, str]:
    from app.run_migrations import run_migrations
    await run_migrations()
    return {"message": "✅ Миграции применены успешно!"}
