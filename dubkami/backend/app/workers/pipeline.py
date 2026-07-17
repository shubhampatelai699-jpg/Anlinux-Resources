"""Main pipeline orchestrator – chains all worker tasks for a single job."""

from __future__ import annotations

import json
import os

from celery import chain

from app.core.database import SessionLocal
from app.models.models import DubbingJob, JobOutput, JobStatus, Speaker
from app.services.celery_app import celery_app


def _update_job(job_id: str, **kwargs):
    db = SessionLocal()
    try:
        job = db.get(DubbingJob, job_id)
        if job:
            for k, v in kwargs.items():
                setattr(job, k, v)
            db.commit()
    finally:
        db.close()


@celery_app.task(bind=True, name="workers.pipeline.run")
def run_dubbing_pipeline(self, job_id: str):
    """Entry point: kicked off when a job is queued."""
    db = SessionLocal()
    try:
        job = db.get(DubbingJob, job_id)
        if not job:
            return
        s3_key = job.input_s3_key
        source_language = job.source_language
        target_languages = json.loads(job.target_languages)
        file_type = job.file_type
    finally:
        db.close()

    _update_job(job_id, status=JobStatus.PROCESSING, progress=5, current_stage="transcription")

    # Stage 1 – STT
    from app.workers.stt import transcribe
    stt_result = transcribe(job_id, s3_key)
    audio_path = stt_result["audio_path"]
    segments = stt_result["segments"]
    _update_job(job_id, progress=20, current_stage="diarization")

    # Stage 2 – Diarization
    from app.workers.diarization import diarize
    diar_result = diarize(job_id, audio_path, segments)
    segments = diar_result["segments"]
    speaker_labels = diar_result["speakers"]

    # Persist speakers and wait for user confirmation
    db = SessionLocal()
    try:
        for label in speaker_labels:
            existing = db.query(Speaker).filter(Speaker.job_id == job_id, Speaker.label == label).first()
            if not existing:
                db.add(Speaker(job_id=job_id, label=label))
        db.commit()
        _update_job(
            job_id,
            status=JobStatus.AWAITING_SPEAKER_CONFIRMATION,
            progress=30,
            current_stage="awaiting_speaker_confirmation",
        )
    finally:
        db.close()

    # Pipeline pauses here; resumed by speakers/confirm-all endpoint


@celery_app.task(bind=True, name="workers.pipeline.resume")
def resume_after_diarization(self, job_id: str):
    """Called after the user confirms all speakers; continues the pipeline."""
    db = SessionLocal()
    try:
        job = db.get(DubbingJob, job_id)
        s3_key = job.input_s3_key
        source_language = job.source_language
        target_languages = json.loads(job.target_languages)
        file_type = job.file_type
        speakers = {s.label: s.voice_id for s in job.speakers}
    finally:
        db.close()

    # Re-run STT to get segments (or cache them – for simplicity we re-run here)
    from app.workers.stt import transcribe
    stt_result = transcribe(job_id, s3_key)
    audio_path = stt_result["audio_path"]
    segments = stt_result["segments"]

    from app.workers.diarization import diarize
    diar_result = diarize(job_id, audio_path, segments)
    segments = diar_result["segments"]

    for target_lang in target_languages:
        _update_job(job_id, progress=40, current_stage=f"translating_to_{target_lang}")

        # Stage 3 – Translation
        from app.workers.translation import translate_segments
        translated = translate_segments(job_id, segments, source_language, target_lang)

        _update_job(job_id, progress=55, current_stage=f"synthesizing_{target_lang}")

        # Stage 4 – TTS
        from app.workers.tts import synthesize_speech
        dubbed_segments = synthesize_speech(job_id, translated, target_lang, speakers)

        _update_job(job_id, progress=70, current_stage=f"mixing_{target_lang}")

        # Stage 5 – Audio mixing (with background noise separation)
        from app.workers.audio_mix import mix_audio
        out_key = mix_audio(job_id, s3_key, dubbed_segments, target_lang, file_type, audio_path)

        # Stage 6 – Lip-sync (video only)
        if file_type == "video":
            _update_job(job_id, progress=85, current_stage=f"lipsync_{target_lang}")
            from app.workers.lipsync import apply_lipsync
            out_key = apply_lipsync(job_id, s3_key, out_key, target_lang)

        # Persist output record
        db = SessionLocal()
        try:
            ext = "mp4" if file_type == "video" else "mp3"
            db.add(JobOutput(job_id=job_id, language=target_lang, s3_key=out_key, format=ext))
            db.commit()
        finally:
            db.close()

    # Clean up temp audio
    try:
        os.unlink(audio_path)
    except OSError:
        pass

    _update_job(job_id, status=JobStatus.COMPLETED, progress=100, current_stage="done")
