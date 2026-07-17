"""Application settings loaded from environment variables."""

from __future__ import annotations

from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Security
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Database
    DATABASE_URL: str = "******localhost:5432/dubkami"

    # Redis / Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    # Object storage (S3-compatible)
    S3_ENDPOINT_URL: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET_INPUT: str = "dubkami-input"
    S3_BUCKET_OUTPUT: str = "dubkami-output"
    S3_REGION: str = "us-east-1"
    S3_PRESIGN_EXPIRY: int = 3600  # seconds

    # File limits
    MAX_UPLOAD_BYTES: int = 5 * 1024 * 1024 * 1024  # 5 GB

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # External AI services (optional – workers fall back to local models)
    ELEVENLABS_API_KEY: str = ""
    DEEPL_API_KEY: str = ""
    GOOGLE_TRANSLATE_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Whisper model size
    WHISPER_MODEL: str = "base"


settings = Settings()
