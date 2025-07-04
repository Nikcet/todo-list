import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.database import DatabaseAPI
from app.models import Admin
from app import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admins/auth")

def get_current_admin(token: str = Depends(oauth2_scheme)) -> Admin:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        username = payload.get("sub")
        if not isinstance(username, str):
            raise credentials_exception
    except jwt.exceptions.DecodeError:
        raise credentials_exception
    db = DatabaseAPI()
    try:
        admin = db.get_admin_by_username(username)
        return admin
    except Exception:
        raise credentials_exception
