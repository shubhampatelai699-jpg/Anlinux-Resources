"""Jobs API: create, status, SSE stream, download."""

from __future__ import annotations

import asyncio
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.models import DubbingJob, JobOutput, JobStatus, User
from app.services import storage as s3_svc
from app.workers.pipeline import run_dubbing_pipeline

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class CreateJobIn(BaseModel):
    original_filename: str
    file_type: str           # "audio" | "video"
    file_size_bytes: int
    source_language: str
    target_languages: List[str]


class UploadUrlOut(BaseModel):
    job_id: str
    upload_url: str
    upload_fields: dict
    s3_key: str


class JobOut(BaseModel):
    id: str
    status: str
    progress: int
    current_stage: Optional[str]
    error_message: Optional[str]
    source_language: str
    target_languages: List[str]
    file_type: str

    class Config:
        from_attributes = True


class OutputOut(BaseModel):
    language: str
    format: str
    download_url: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def _job_or_404(job_id: str, db: Session, user: User) -> DubbingJob:
    job = db.get(DubbingJob, job_id)
    if not job or job.owner_id != user.id:
        raise HTTPException(404, "Job not found")
    return job


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/", response_model=UploadUrlOut, status_code=201)
def create_job(
    body: CreateJobIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from app.core.config import settings

    if body.file_size_bytes > settings.MAX_UPLOAD_BYTES:
        raise HTTPException(413, "File exceeds 5 GB limit")
    if body.file_type not in ("audio", "video"):
        raise HTTPException(422, "file_type must be 'audio' or 'video'")

    job = DubbingJob(
        owner_id=user.id,
        original_filename=body.original_filename,
        file_type=body.file_type,
        file_size_bytes=body.file_size_bytes,
        source_language=body.source_language,
        target_languages=json.dumps(body.target_languages),
        status=JobStatus.UPLOADING,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    presign = s3_svc.generate_presigned_upload(job.id, body.original_filename, f"{body.file_type}/*")
    job.input_s3_key = presign["key"]
    db.commit()

    return UploadUrlOut(
        job_id=job.id,
        upload_url=presign["url"],
        upload_fields=presign["fields"],
        s3_key=presign["key"],
    )


@router.post("/{job_id}/start")
def start_job(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Called by the frontend after the S3 upload completes."""
    job = _job_or_404(job_id, db, user)
    if job.status != JobStatus.UPLOADING:
        raise HTTPException(409, "Job is not in UPLOADING state")
    job.status = JobStatus.QUEUED
    db.commit()
    result = run_dubbing_pipeline.delay(job_id)
    job.celery_task_id = result.id
    db.commit()
    return {"detail": "Job queued", "task_id": result.id}


@router.get("/{job_id}", response_model=JobOut)
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    job = _job_or_404(job_id, db, user)
    out = JobOut.model_validate(job)
    out.target_languages = json.loads(job.target_languages)
    return out


@router.get("/{job_id}/outputs", response_model=List[OutputOut])
def get_outputs(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    job = _job_or_404(job_id, db, user)
    if job.status != JobStatus.COMPLETED:
        raise HTTPException(409, "Job not yet completed")
    outputs = db.query(JobOutput).filter(JobOutput.job_id == job_id).all()
    return [
        OutputOut(
            language=o.language,
            format=o.format,
            download_url=s3_svc.generate_presigned_download(o.s3_key),
        )
        for o in outputs
    ]


@router.get("/{job_id}/stream")
async def stream_job_status(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Server-Sent Events stream for real-time job progress."""
    job = _job_or_404(job_id, db, user)

    async def event_generator():
        last_status = None
        while True:
            db.expire(job)
            db.refresh(job)
            payload = json.dumps({
                "status": job.status.value,
                "progress": job.progress,
                "stage": job.current_stage,
            })
            if payload != last_status:
                last_status = payload
                yield f"data: {payload}\n\n"
            if job.status in (JobStatus.COMPLETED, JobStatus.FAILED):
                break
            await asyncio.sleep(2)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
