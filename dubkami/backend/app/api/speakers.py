"""Speakers API: list diarized speakers, confirm names/voices."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.models import DubbingJob, JobStatus, Speaker, User

router = APIRouter()


class SpeakerOut(BaseModel):
    id: str
    label: str
    display_name: Optional[str]
    voice_id: Optional[str]
    confirmed: bool

    class Config:
        from_attributes = True


class ConfirmSpeakerIn(BaseModel):
    display_name: Optional[str] = None
    voice_id: Optional[str] = None


@router.get("/job/{job_id}", response_model=List[SpeakerOut])
def list_speakers(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    job = db.get(DubbingJob, job_id)
    if not job or job.owner_id != user.id:
        raise HTTPException(404, "Job not found")
    return db.query(Speaker).filter(Speaker.job_id == job_id).all()


@router.patch("/{speaker_id}", response_model=SpeakerOut)
def update_speaker(
    speaker_id: str,
    body: ConfirmSpeakerIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    speaker = db.get(Speaker, speaker_id)
    if not speaker:
        raise HTTPException(404, "Speaker not found")
    job = db.get(DubbingJob, speaker.job_id)
    if not job or job.owner_id != user.id:
        raise HTTPException(403, "Forbidden")
    if body.display_name is not None:
        speaker.display_name = body.display_name
    if body.voice_id is not None:
        speaker.voice_id = body.voice_id
    speaker.confirmed = True
    db.commit()
    db.refresh(speaker)
    return speaker


@router.post("/job/{job_id}/confirm-all")
def confirm_all_speakers(
    job_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """After user confirms all speakers, advance the job to continue processing."""
    job = db.get(DubbingJob, job_id)
    if not job or job.owner_id != user.id:
        raise HTTPException(404, "Job not found")
    if job.status != JobStatus.AWAITING_SPEAKER_CONFIRMATION:
        raise HTTPException(409, "Job is not awaiting speaker confirmation")

    speakers = db.query(Speaker).filter(Speaker.job_id == job_id).all()
    for s in speakers:
        s.confirmed = True

    job.status = JobStatus.PROCESSING
    db.commit()

    # Resume pipeline from TTS stage
    from app.workers.pipeline import resume_after_diarization
    resume_after_diarization.delay(job_id)

    return {"detail": "Speakers confirmed, processing resumed"}
