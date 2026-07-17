"""Lip-sync worker using Wav2Lip (video only)."""

from __future__ import annotations

import os
import subprocess
import tempfile

import boto3

from app.core.config import settings
from app.services.celery_app import celery_app


@celery_app.task(bind=True, name="workers.lipsync")
def apply_lipsync(self, job_id: str, input_s3_key: str, dubbed_audio_s3_key: str, target_language: str) -> str:
    """
    Download the original video and the dubbed audio, run Wav2Lip,
    upload the result to S3 and return the new S3 key.
    """
    s3 = boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL or None,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        region_name=settings.S3_REGION,
    )

    with tempfile.TemporaryDirectory() as tmp_dir:
        video_path = os.path.join(tmp_dir, "original.mp4")
        audio_path = os.path.join(tmp_dir, "dubbed.mp3")
        out_path = os.path.join(tmp_dir, "lipsync.mp4")

        s3.download_file(settings.S3_BUCKET_INPUT, input_s3_key, video_path)
        s3.download_file(settings.S3_BUCKET_OUTPUT, dubbed_audio_s3_key, audio_path)

        # Wav2Lip inference (requires Wav2Lip repo in PYTHONPATH)
        wav2lip_script = os.environ.get("WAV2LIP_SCRIPT", "/app/Wav2Lip/inference.py")
        checkpoint = os.environ.get("WAV2LIP_CHECKPOINT", "/models/wav2lip_gan.pth")

        subprocess.run(
            [
                "python", wav2lip_script,
                "--checkpoint_path", checkpoint,
                "--face", video_path,
                "--audio", audio_path,
                "--outfile", out_path,
                "--pads", "0", "10", "0", "0",
            ],
            check=True,
        )

        out_key = f"output/{job_id}/{target_language}_lipsync.mp4"
        s3.upload_file(out_path, settings.S3_BUCKET_OUTPUT, out_key)

    return out_key
