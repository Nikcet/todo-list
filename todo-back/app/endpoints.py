from pydantic import HttpUrl
from fastapi import APIRouter, Depends, HTTPException, Body, Query
import traceback
from typing import List

from app.database import DatabaseAPI, DatabaseError, NotFoundError, UpdateError, DeleteError
from app.models import Task, Admin
from app import logger

router = APIRouter()

db = DatabaseAPI()

# --- Task CRUD ---
@router.post("/tasks/", response_model=Task)
def create_task(task: Task):
    try:
        result = db.create_task(task)
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while creating task")

@router.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    try:
        result = db.get_task(task_id)
        return result
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting task")

@router.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, data: dict = Body(...)):
    try:
        result = db.update_task(task_id, **data)
        return result
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except UpdateError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while updating task")

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    try:
        db.delete_task(task_id)
        return {"success": True}
    except NotFoundError as e:
        logger.warning(str(e))
        raise HTTPException(status_code=404, detail=str(e))
    except DeleteError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while deleting task")

# --- Admin CRUD ---
@router.post("/admins/", response_model=Admin)
def create_admin(admin: Admin):
    try:
        result = db.create_admin(admin)
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
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
        raise HTTPException(status_code=404, detail=str(e))
    except DeleteError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while deleting admin")

# --- Task Queries ---
@router.get("/tasks/", response_model=List[Task])
def get_tasks_paginated(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_paginated(offset=offset, limit=limit)
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks")

@router.get("/tasks/sorted/username", response_model=List[Task])
def get_tasks_sorted_by_username(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_sorted_by_username(offset=offset, limit=limit)
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks sorted by username")

@router.get("/tasks/sorted/email", response_model=List[Task])
def get_tasks_sorted_by_email(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_sorted_by_email(offset=offset, limit=limit)
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks sorted by email")

@router.get("/tasks/sorted/status", response_model=List[Task])
def get_tasks_sorted_by_status(offset: int = Query(0), limit: int = Query(3)):
    try:
        result = db.get_tasks_sorted_by_status(offset=offset, limit=limit)
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting tasks sorted by status")

@router.get("/tasks/all", response_model=List[Task])
def get_all_tasks():
    try:
        result = db.get_all_tasks()
        return result
    except DatabaseError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Unexpected error while getting all tasks")
