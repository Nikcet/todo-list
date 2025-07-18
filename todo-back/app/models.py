from sqlmodel import SQLModel, Field
from shortuuid import uuid


class Task(SQLModel, table=True):
    id: str = Field(default_factory=uuid, primary_key=True)
    username: str = Field(
        min_length=2,
        max_length=30,
    )
    email: str
    text: str = Field(min_length=1, max_length=300)
    status: bool = Field(default=False)
    edited_by_admin: bool = Field(default=False)


class Admin(SQLModel, table=True):
    id: str = Field(default_factory=uuid, primary_key=True)
    username: str = Field(min_length=2, max_length=30, unique=True)
    password: str = Field(min_length=3)
