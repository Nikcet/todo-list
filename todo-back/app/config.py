import os
from dotenv import load_dotenv
from functools import lru_cache

from pydantic_settings import BaseSettings

from app import logger

load_dotenv()


class Settings(BaseSettings):
    jwt_secret_key: str = os.environ["JWT_SECRET_KEY"]
    jwt_algorithm: str = os.environ["JWT_ALGORITHM"]
    jwt_access_token_expire_minutes: int = 60 * 24 * 7

    db_url: str = os.environ["DB_URL"]

@lru_cache
def get_settings() -> Settings:
    logger.info("Loading settings...")
    return Settings()


__all__ = ["get_settings"]
