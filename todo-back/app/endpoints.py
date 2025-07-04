from pydantic import HttpUrl
from fastapi import APIRouter, Depends, HTTPException, Body, Query
import traceback
from typing import List

from app.database import DatabaseAPI, DatabaseError, NotFoundError, UpdateError, DeleteError
from app.schemas import TaskCreate, TaskRead, AdminCreate, AdminRead
from app.models import Task, Admin
from app import logger

router = APIRouter()

db = DatabaseAPI()

# --- Task CRUD ---
@router.post("/task/", response_model=TaskRead)
def create_task(task: TaskCreate):
    try:
        result = db.create_task(Task(**task.model_dump()))
        return TaskRead(**result.model_dump())
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while creating task")

@router.get("/task/{task_id}", response_model=TaskRead)
def get_task(task_id: str):
    try:
        result = db.get_task(task_id)
        return TaskRead(**result.model_dump())
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting task")

@router.patch("/task/{task_id}", response_model=TaskRead)
def update_task(task_id: str, data: TaskCreate):
    try:
        result = db.update_task(task_id, **data.model_dump())
        return TaskRead(**result.model_dump())
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except UpdateError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while updating task")

@router.delete("/task/{task_id}")
def delete_task(task_id: str):
    try:
        db.delete_task(task_id)
        return {"success": True}
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except DeleteError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while deleting task")

# --- Admin CRUD ---
@router.post("/admins/", response_model=AdminRead)
def create_admin(admin: AdminCreate):
    try:
        result = db.create_admin(Admin(**admin.model_dump()))
        return AdminRead(**result.model_dump())
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while creating admin")

@router.delete("/admins/{admin_id}")
def delete_admin(admin_id: str):
    try:
        db.delete_admin(admin_id)
        return {"success": True}
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=e.status_code, detail=str(e))
    except DeleteError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while deleting admin")

# --- Task Queries ---
@router.get("/tasks/", response_model=List[TaskRead])
def get_tasks_paginated(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_paginated(offset=offset, limit=limit)
        return [TaskRead(**task.model_dump()) for task in result]
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks")

@router.get("/tasks/sorted/username", response_model=List[TaskRead])
def get_tasks_sorted_by_username(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_sorted_by_username(offset=offset, limit=limit)
        return [TaskRead(**task.model_dump()) for task in result]
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks sorted by username")

@router.get("/tasks/sorted/email", response_model=List[TaskRead])
def get_tasks_sorted_by_email(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_sorted_by_email(offset=offset, limit=limit)
        return [TaskRead(**task.model_dump()) for task in result]
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks sorted by email")

@router.get("/tasks/sorted/status", response_model=List[TaskRead])
def get_tasks_sorted_by_status(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_sorted_by_status(offset=offset, limit=limit)
        return [TaskRead(**task.model_dump()) for task in result]
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks sorted by status")

@router.get("/tasks", response_model=List[TaskRead])
def get_all_tasks():
    try:
        result = db.get_all_tasks()
        return [TaskRead(**task.model_dump()) for task in result]
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=e.status_code, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting all tasks")
