from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.test import Test, Question, UserResult
from app.models.user import User
from app.routes.auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/tests", tags=["Tests"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 📦 Модель ответа на вопрос
class Answer(BaseModel):
    question_id: int
    answer: int

# 📦 Модель отправки всех ответов на тест
class SubmitTestRequest(BaseModel):
    answers: List[Answer]

# 📦 Модель ответа вопроса для фронта
class QuestionResponse(BaseModel):
    id: int
    question_a: str
    question_b: str
    position: int

# 🔹 Получить вопросы теста
@router.get("/{test_id}/questions", response_model=List[QuestionResponse])
def get_test_questions(test_id: int, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.test_id == test_id).order_by(Question.position).all()
    return [
        QuestionResponse(
            id=q.id,
            question_a=q.question_a,
            question_b=q.question_b,
            position=q.position
        )
        for q in questions
    ]

# 🔸 Отправить результаты теста
@router.post("/{test_id}/submit")
def submit_test_answers(
    test_id: int,
    request: SubmitTestRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Тест не найден")

    for answer in request.answers:
        db_answer = UserAnswer(
            user_id=user.id,
            test_id=test_id,
            question_id=answer.question_id,
            answer=answer.answer
        )
        db.add(db_answer)
    
    db.commit()
    return {"message": "✅ Ответы сохранены!"}

# 🔹 Получить результаты тестов пользователя
@router.get("/my-results", response_model=List[dict])
def get_user_results(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    results = (
        db.query(UserResult)
        .filter(UserResult.user_id == user.id)
        .all()
    )
    return [
        {
            "test_id": r.test_id,
            "result_data": r.result_data,
            "created_at": r.created_at
        }
        for r in results
    ]
