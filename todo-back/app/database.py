from sqlmodel import SQLModel, Session, create_engine, select
from typing import List
from sqlalchemy import Column, desc

from app.models import Task, Admin
from app.errors import DatabaseError, NotFoundError, UpdateError, DeleteError
from app.utils import get_password_hash
from app import settings


class DatabaseAPI:
    """
    Class for interacting with SQLite database via SQLModel.
    Supports CRUD operations for tasks and admins, as well as methods for sorting and paginating tasks.
    All methods raise exceptions on errors for handling in endpoints.
    """

    def __init__(self, db_url: str = settings.db_url):
        try:
            self.engine = create_engine(db_url, echo=False)
            SQLModel.metadata.create_all(self.engine)
        except Exception as e:
            raise DatabaseError(f"Database initialization error: {e}")

    def create_task(self, task: Task) -> Task:
        """Create a new task."""
        try:
            with Session(self.engine) as session:
                session.add(task)
                session.commit()
                session.refresh(task)
                return task
        except Exception as e:
            raise DatabaseError(f"Error creating task: {e}")

    def get_task(self, task_id: str) -> Task:
        """Get a task by id."""
        try:
            with Session(self.engine) as session:
                task = session.get(Task, task_id)
                if not task:
                    raise NotFoundError(f"Task with id {task_id} not found")
                return task
        except NotFoundError:
            raise
        except Exception as e:
            raise DatabaseError(f"Error getting task: {e}")

    def update_task(self, task_id: str, **kwargs) -> Task:
        """Update a task by id."""
        try:
            with Session(self.engine) as session:
                task = session.get(Task, task_id)
                if not task:
                    raise NotFoundError(f"Task with id {task_id} not found")
                for key, value in kwargs.items():
                    if hasattr(task, key):
                        setattr(task, key, value)
                session.commit()
                session.refresh(task)
                return task
        except NotFoundError:
            raise
        except Exception as e:
            raise UpdateError(f"Error updating task: {e}")

    def delete_task(self, task_id: str) -> None:
        """Delete a task by id."""
        try:
            with Session(self.engine) as session:
                task = session.get(Task, task_id)
                if not task:
                    raise NotFoundError(f"Task with id {task_id} not found")
                session.delete(task)
                session.commit()
        except NotFoundError:
            raise
        except Exception as e:
            raise DeleteError(f"Error deleting task: {e}")

    def get_all_tasks(self) -> List[Task]:
        """Get all tasks."""
        try:
            with Session(self.engine) as session:
                statement = select(Task)
                return list(session.exec(statement))
        except Exception as e:
            raise DatabaseError(f"Error getting all tasks: {e}")

    def create_admin(self, admin: Admin) -> Admin:
        """Create a new admin."""
        try:
            admin.password = get_password_hash(admin.password)
            with Session(self.engine) as session:

                statement = select(Admin).where(Admin.username == admin.username)
                if session.exec(statement).first():
                    raise DatabaseError(
                        f"Admin with username {admin.username} already exists"
                    )

                session.add(admin)
                session.commit()
                session.refresh(admin)
                return admin
        except Exception as e:
            raise DatabaseError(f"Error creating admin: {e}")

    def delete_admin(self, admin_id: str) -> None:
        """Delete an admin by id."""
        try:
            with Session(self.engine) as session:
                admin = session.get(Admin, admin_id)
                if not admin:
                    raise NotFoundError(f"Admin with id {admin_id} not found")
                session.delete(admin)
                session.commit()
        except NotFoundError:
            raise
        except Exception as e:
            raise DeleteError(f"Error deleting admin: {e}")

    def get_admin_by_username(self, username: str) -> Admin:
        """Get admin by username."""
        try:
            with Session(self.engine) as session:
                statement = select(Admin).where(Admin.username == username)
                admin = session.exec(statement).first()
                if not admin:
                    raise NotFoundError(f"Admin with username {username} not found")
                return admin
        except NotFoundError:
            raise
        except Exception as e:
            raise DatabaseError(f"Error getting admin: {e}")

    def get_tasks_paginated(self, offset: int = 0, limit: int = 3) -> List[Task]:
        """Get tasks with pagination."""
        try:
            with Session(self.engine) as session:
                statement = select(Task).offset(offset).limit(limit)
                return list(session.exec(statement))
        except Exception as e:
            raise DatabaseError(f"Error getting paginated tasks: {e}")

    def get_tasks_sorted_by_username(
        self, offset: int = 0, limit: int = 3, reverse: bool = False
    ) -> List[Task]:
        """Get tasks sorted by username with pagination."""
        try:
            with Session(self.engine) as session:
                if reverse:
                    statement = (
                        select(Task).order_by(desc(Task.username)).offset(offset).limit(limit)
                    )
                else:
                    statement = (
                        select(Task).order_by(Task.username).offset(offset).limit(limit)
                    )
                return list(session.exec(statement))
        except Exception as e:
            raise DatabaseError(f"Error sorting tasks by username: {e}")

    def get_tasks_sorted_by_email(
        self, offset: int = 0, limit: int = 3, reverse: bool = False
    ) -> List[Task]:
        """Get tasks sorted by email with pagination."""
        try:
            with Session(self.engine) as session:
                if reverse:
                    statement = (
                        select(Task).order_by(desc(Task.email)).offset(offset).limit(limit)
                    )
                else:
                    statement = (
                        select(Task).order_by(Task.email).offset(offset).limit(limit)
                    )
                return list(session.exec(statement))
        except Exception as e:
            raise DatabaseError(f"Error sorting tasks by email: {e}")

    def get_tasks_sorted_by_status(
        self, offset: int = 0, limit: int = 3, reverse: bool = False
    ) -> List[Task]:
        """Get tasks sorted by status with pagination."""
        try:
            with Session(self.engine) as session:
                if reverse:
                    statement = (
                        select(Task).order_by(desc(Column("status"))).offset(offset).limit(limit)
                    )
                else:
                    statement = (
                        select(Task).order_by(Column("status")).offset(offset).limit(limit)
                    )
                return list(session.exec(statement))
        except Exception as e:
            raise DatabaseError(f"Error sorting tasks by status: {e}")
