from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class TaskCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=30)
    email: EmailStr
    text: str = Field(..., min_length=1, max_length=300)
    status: Optional[bool] = False

class TaskRead(BaseModel):
    id: str
    username: str
    email: EmailStr
    text: str
    status: bool

class AdminCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=30)
    password: str = Field(..., min_length=3)

class AdminRead(BaseModel):
    id: str
    username: str

class AdminAuth(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
