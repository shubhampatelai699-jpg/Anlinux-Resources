"""Celery application instance."""

from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "dubkami",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.workers.pipeline",
        "app.workers.stt",
        "app.workers.diarization",
        "app.workers.translation",
        "app.workers.tts",
        "app.workers.lipsync",
        "app.workers.audio_mix",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,  # one task at a time per worker (GPU-heavy)
)
