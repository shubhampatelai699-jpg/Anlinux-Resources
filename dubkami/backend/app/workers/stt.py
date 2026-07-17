"""Speech-to-Text worker using OpenAI Whisper."""

from __future__ import annotations

import os
import tempfile

import boto3
import whisper

from app.core.config import settings
from app.services.celery_app import celery_app


@celery_app.task(bind=True, name="workers.stt")
def transcribe(self, job_id: str, s3_key: str) -> dict:
    """
    Download the input file from S3, run Whisper STT,
    return a list of word-level segments with speaker placeholders.
    """
    model = whisper.load_model(settings.WHISPER_MODEL)

    s3 = boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL or None,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        region_name=settings.S3_REGION,
    )

    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(s3_key)[-1]) as tmp:
        tmp_path = tmp.name
        s3.download_file(settings.S3_BUCKET_INPUT, s3_key, tmp_path)

    try:
        result = model.transcribe(
            tmp_path,
            word_timestamps=True,
            verbose=False,
        )
        segments = [
            {
                "start": seg["start"],
                "end": seg["end"],
                "text": seg["text"].strip(),
                "words": seg.get("words", []),
            }
            for seg in result["segments"]
        ]
        return {
            "language": result["language"],
            "segments": segments,
            "audio_path": tmp_path,  # kept for diarization stage
        }
    except Exception:
        os.unlink(tmp_path)
        raise
