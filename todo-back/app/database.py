from sqlmodel import SQLModel, Session, create_engine, select
from app.models import Task, Admin
from typing import List, Optional
from sqlalchemy import Column
from app import logger

class DatabaseAPI:
    """
    Class for interacting with SQLite database via SQLModel.
    Supports CRUD operations for tasks and admins, as well as methods for sorting and paginating tasks.
    All methods are fault-tolerant: on errors, they return None or False and log exceptions.
    """
    def __init__(self, db_url: str = "sqlite:///database.db"):
        try:
            self.engine = create_engine(db_url, echo=False)
            SQLModel.metadata.create_all(self.engine)
        except Exception as e:
            logger.error(f"Database initialization error: {e}")
            self.engine = None

    # --- Task CRUD ---
    def create_task(self, task: Task) -> Optional[Task]:
        """Create a new task."""
        try:
            with Session(self.engine) as session:
                session.add(task)
                session.commit()
                session.refresh(task)
                return task
        except Exception as e:
            logger.error(f"Error creating task: {e}")
            return None

    def get_task(self, task_id: str) -> Optional[Task]:
        """Get a task by id."""
        try:
            with Session(self.engine) as session:
                return session.get(Task, task_id)
        except Exception as e:
            logger.error(f"Error getting task: {e}")
            return None

    def update_task(self, task_id: str, **kwargs) -> Optional[Task]:
        """Update a task by id."""
        try:
            with Session(self.engine) as session:
                task = session.get(Task, task_id)
                if not task:
                    return None
                for key, value in kwargs.items():
                    if hasattr(task, key):
                        try:
                            setattr(task, key, value)
                        except Exception as e:
                            logger.warning(f"Error updating field {key}: {e}")
                session.commit()
                session.refresh(task)
                return task
        except Exception as e:
            logger.error(f"Error updating task: {e}")
            return None

    def delete_task(self, task_id: str) -> bool:
        """Delete a task by id."""
        try:
            with Session(self.engine) as session:
                task = session.get(Task, task_id)
                if not task:
                    return False
                session.delete(task)
                session.commit()
                return True
        except Exception as e:
            logger.error(f"Error deleting task: {e}")
            return False

    # --- Admin CRUD ---
    def create_admin(self, admin: Admin) -> Optional[Admin]:
        """Create a new admin."""
        try:
            with Session(self.engine) as session:
                session.add(admin)
                session.commit()
                session.refresh(admin)
                return admin
        except Exception as e:
            logger.error(f"Error creating admin: {e}")
            return None

    def delete_admin(self, admin_id: str) -> bool:
        """Delete an admin by id."""
        try:
            with Session(self.engine) as session:
                admin = session.get(Admin, admin_id)
                if not admin:
                    return False
                session.delete(admin)
                session.commit()
                return True
        except Exception as e:
            logger.error(f"Error deleting admin: {e}")
            return False

    # --- Task Queries ---
    def get_tasks_paginated(self, offset: int = 0, limit: int = 3) -> Optional[List[Task]]:
        """Get tasks with pagination."""
        try:
            with Session(self.engine) as session:
                statement = select(Task).offset(offset).limit(limit)
                return list(session.exec(statement))
        except Exception as e:
            logger.error(f"Error getting paginated tasks: {e}")
            return None

    def get_tasks_sorted_by_username(self, offset: int = 0, limit: int = 3) -> Optional[List[Task]]:
        """Get tasks sorted by username with pagination."""
        try:
            with Session(self.engine) as session:
                statement = select(Task).order_by(Task.username).offset(offset).limit(limit)
                return list(session.exec(statement))
        except Exception as e:
            logger.error(f"Error sorting tasks by username: {e}")
            return None

    def get_tasks_sorted_by_email(self, offset: int = 0, limit: int = 3) -> Optional[List[Task]]:
        """Get tasks sorted by email with pagination."""
        try:
            with Session(self.engine) as session:
                statement = select(Task).order_by(Task.email).offset(offset).limit(limit)
                return list(session.exec(statement))
        except Exception as e:
            logger.error(f"Error sorting tasks by email: {e}")
            return None

    def get_tasks_sorted_by_status(self, offset: int = 0, limit: int = 3) -> Optional[List[Task]]:
        """Get tasks sorted by status with pagination."""
        try:
            with Session(self.engine) as session:
                statement = select(Task).order_by(Column('status')).offset(offset).limit(limit)
                return list(session.exec(statement))
        except Exception as e:
            logger.error(f"Error sorting tasks by status: {e}")
            return None

    def get_all_tasks(self) -> Optional[List[Task]]:
        """Get all tasks."""
        try:
            with Session(self.engine) as session:
                statement = select(Task)
                return list(session.exec(statement))
        except Exception as e:
            logger.error(f"Error getting all tasks: {e}")
            return None

