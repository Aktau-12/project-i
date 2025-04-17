# app/schemas/user.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="Email пользователя")
    password: str = Field(..., min_length=8)
    name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    xp: int
    mbti_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
