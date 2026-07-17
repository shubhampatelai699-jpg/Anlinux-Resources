"""Background noise separation and audio mixing with FFmpeg."""

from __future__ import annotations

import os
import subprocess
import tempfile
from typing import List

import boto3

from app.core.config import settings
from app.services.celery_app import celery_app


def _separate_background(audio_path: str) -> str:
    """Use Demucs to separate vocals and return background track path."""
    out_dir = tempfile.mkdtemp()
    subprocess.run(
        ["python", "-m", "demucs", "--two-stems=vocals", "-o", out_dir, audio_path],
        check=True,
    )
    # Demucs writes: out_dir/htdemucs/<stem>/<filename>/no_vocals.wav
    base = os.path.splitext(os.path.basename(audio_path))[0]
    bg_path = os.path.join(out_dir, "htdemucs", base, "no_vocals.wav")
    return bg_path


def _assemble_audio(segments: list, bg_path: str, duration: float, out_path: str):
    """
    Build a single audio file by:
    1. Writing each TTS chunk at the correct timestamp.
    2. Mixing with the background track.
    """
    with tempfile.TemporaryDirectory() as tmp_dir:
        # Write TTS clips
        inputs = []
        filter_parts = []
        for i, seg in enumerate(segments):
            clip_path = os.path.join(tmp_dir, f"clip_{i}.wav")
            with open(clip_path, "wb") as f:
                f.write(bytes.fromhex(seg["audio_bytes_hex"]))
            delay_ms = int(seg["start"] * 1000)
            inputs += ["-i", clip_path]
            filter_parts.append(f"[{i + 1}]adelay={delay_ms}|{delay_ms}[d{i}]")

        n = len(segments)
        mix_labels = "".join(f"[d{i}]" for i in range(n))
        filter_parts.append(f"{mix_labels}amix=inputs={n}:normalize=0[speech]")
        filter_parts.append(f"[0][speech]amix=inputs=2:normalize=0[out]")

        filter_complex = ";".join(filter_parts)
        cmd = (
            ["ffmpeg", "-y", "-i", bg_path]
            + inputs
            + ["-filter_complex", filter_complex, "-map", "[out]", out_path]
        )
        subprocess.run(cmd, check=True)


@celery_app.task(bind=True, name="workers.audio_mix")
def mix_audio(
    self,
    job_id: str,
    input_s3_key: str,
    segments: list,
    target_language: str,
    file_type: str,
    audio_path: str,
) -> str:
    """
    1. Separate background from original.
    2. Mix dubbed speech with background.
    3. For video: replace audio track.
    4. Upload to S3 output bucket and return the S3 key.
    """
    s3 = boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT_URL or None,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        region_name=settings.S3_REGION,
    )

    with tempfile.TemporaryDirectory() as tmp_dir:
        bg_path = _separate_background(audio_path)

        mixed_audio = os.path.join(tmp_dir, "dubbed_audio.wav")
        duration = max(seg["end"] for seg in segments)
        _assemble_audio(segments, bg_path, duration, mixed_audio)

        if file_type == "video":
            # Download original video
            video_path = os.path.join(tmp_dir, "original.mp4")
            s3.download_file(settings.S3_BUCKET_INPUT, input_s3_key, video_path)
            out_path = os.path.join(tmp_dir, f"dubbed_{target_language}.mp4")
            subprocess.run(
                [
                    "ffmpeg", "-y",
                    "-i", video_path,
                    "-i", mixed_audio,
                    "-c:v", "copy",
                    "-map", "0:v:0",
                    "-map", "1:a:0",
                    "-shortest",
                    out_path,
                ],
                check=True,
            )
            ext = "mp4"
        else:
            out_path = os.path.join(tmp_dir, f"dubbed_{target_language}.mp3")
            subprocess.run(
                ["ffmpeg", "-y", "-i", mixed_audio, "-q:a", "2", out_path],
                check=True,
            )
            ext = "mp3"

        out_key = f"output/{job_id}/{target_language}.{ext}"
        s3.upload_file(out_path, settings.S3_BUCKET_OUTPUT, out_key)

    return out_key
