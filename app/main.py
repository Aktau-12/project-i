from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os

# 🔄 Загружаем переменные окружения из .env (папка app/)
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

# 📆 Импорт роутеров
from app.routes import user, auth, test, coretalents, mbti, hero, rating, habit

# 🚀 Создаём FastAPI-приложение
app = FastAPI(
    title="AI Profiler",
    description="🧠 Платформа для психологических тестов, саморазвития и AI-помощи",
    version="1.0.0",
)

# 🌐 Разрешаем CORS для всех (временно для тестов)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ разрешить запросы с любого фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔌 Подключаем роутеры
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(test.router, prefix="/tests", tags=["Tests"])
app.include_router(coretalents.router, prefix="/coretalents", tags=["CoreTalents"])
app.include_router(mbti.router, prefix="/mbti", tags=["MBTI"])
print("🧠 MBTI router подключён!")
app.include_router(hero.router, prefix="/hero", tags=["Hero"])
app.include_router(rating.router, prefix="/rating", tags=["Rating"])
app.include_router(habit.router, prefix="/habits", tags=["Habits"])

# 🏠 Главная страница
@app.get("/")
def home():
    return {"message": "✅ AI Profiler успешно работает!"}

# 🚀 Специальный маршрут для выполнения миграций
@app.get("/run-migrations")
async def run_migrations_from_api():
    from app.run_migrations import run_migrations
    await run_migrations()
    return {"message": "✅ Миграции применены успешно!"}
