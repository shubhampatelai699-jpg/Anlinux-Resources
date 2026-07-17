"""SQLAlchemy ORM models."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class BillingPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class StudioRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    jobs: Mapped[List["DubbingJob"]] = relationship("DubbingJob", back_populates="owner")
    studio_memberships: Mapped[List["StudioMember"]] = relationship(
        "StudioMember", foreign_keys="StudioMember.user_id", back_populates="user"
    )
    owned_studios: Mapped[List["Studio"]] = relationship("Studio", back_populates="owner")


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    UPLOADING = "uploading"
    QUEUED = "queued"
    PROCESSING = "processing"
    AWAITING_SPEAKER_CONFIRMATION = "awaiting_speaker_confirmation"
    COMPLETED = "completed"
    FAILED = "failed"


class DubbingJob(Base):
    __tablename__ = "dubbing_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), default=JobStatus.PENDING, nullable=False)

    # File info
    original_filename: Mapped[str] = mapped_column(String(512), nullable=False)
    file_type: Mapped[str] = mapped_column(String(16), nullable=False)  # "audio" | "video"
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_seconds: Mapped[Optional[float]] = mapped_column(nullable=True)

    # Language
    source_language: Mapped[str] = mapped_column(String(16), nullable=False)
    target_languages: Mapped[str] = mapped_column(Text, nullable=False)  # JSON array

    # Storage keys
    input_s3_key: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    celery_task_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Studio association (optional)
    studio_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("studios.id"), nullable=True)

    # Progress (0-100)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    current_stage: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, onupdate=_now)

    owner: Mapped["User"] = relationship("User", back_populates="jobs")
    studio: Mapped[Optional["Studio"]] = relationship("Studio", back_populates="jobs")
    speakers: Mapped[List["Speaker"]] = relationship("Speaker", back_populates="job", cascade="all, delete-orphan")
    outputs: Mapped[List["JobOutput"]] = relationship("JobOutput", back_populates="job", cascade="all, delete-orphan")


class Studio(Base):
    __tablename__ = "studios"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    plan: Mapped[BillingPlan] = mapped_column(Enum(BillingPlan), default=BillingPlan.FREE, nullable=False)
    # Cumulative seconds of audio/video processed this calendar month
    usage_seconds_month: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, onupdate=_now)

    owner: Mapped["User"] = relationship("User", back_populates="owned_studios")
    members: Mapped[List["StudioMember"]] = relationship(
        "StudioMember", back_populates="studio", cascade="all, delete-orphan"
    )
    jobs: Mapped[List["DubbingJob"]] = relationship("DubbingJob", back_populates="studio")


class StudioMember(Base):
    __tablename__ = "studio_members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    studio_id: Mapped[str] = mapped_column(String(36), ForeignKey("studios.id"), nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    # email is stored for pending invites where user_id is not yet known
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[StudioRole] = mapped_column(Enum(StudioRole), default=StudioRole.MEMBER, nullable=False)
    pending: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    invited_by: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    studio: Mapped["Studio"] = relationship("Studio", back_populates="members")
    user: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[user_id], back_populates="studio_memberships"
    )


class Speaker(Base):
    __tablename__ = "speakers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("dubbing_jobs.id"), nullable=False)
    label: Mapped[str] = mapped_column(String(64), nullable=False)      # e.g. "SPEAKER_00"
    display_name: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)  # user-provided
    voice_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)      # TTS voice assigned
    confirmed: Mapped[bool] = mapped_column(default=False)

    job: Mapped["DubbingJob"] = relationship("DubbingJob", back_populates="speakers")


class JobOutput(Base):
    __tablename__ = "job_outputs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("dubbing_jobs.id"), nullable=False)
    language: Mapped[str] = mapped_column(String(16), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(512), nullable=False)
    format: Mapped[str] = mapped_column(String(8), nullable=False)  # mp4, mp3, wav, mkv

    job: Mapped["DubbingJob"] = relationship("DubbingJob", back_populates="outputs")
