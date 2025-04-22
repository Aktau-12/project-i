from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os

# 🔄 Загружаем переменные окружения из .env
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# 🕒 Импорт роутеров
from app.routes import user, auth, test, coretalents, mbti, hero, rating, habit

# 🚀 Создаём FastAPI-приложение
app = FastAPI(
    title="AI Profiler",
    description="🦱 Платформа для психологических тестов, саморазвития и AI-помощи",
    version="1.0.0",
)

# 🌐 Настройки CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
if allowed_origins == [""]:  # если нет переменной окружения
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://patient-happiness-production.up.railway.app",
        "https://lively-enjoyment-production.up.railway.app",
    ]

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
@app.get("/")
def home():
    return {"message": "✅ AI Profiler успешно работает!"}

# 🚀 Роут для запуска миграций
@app.get("/run-migrations")
async def run_migrations_from_api():
    from app.run_migrations import run_migrations
    await run_migrations()
    return {"message": "✅ Миграции применены успешно!"}
