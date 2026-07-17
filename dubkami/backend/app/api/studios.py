"""Studios API: CRUD, team management, billing."""

from __future__ import annotations

import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.models import (
    BillingPlan,
    DubbingJob,
    Studio,
    StudioMember,
    StudioRole,
    User,
)

router = APIRouter()

# ── Plan limits ───────────────────────────────────────────────────────────────

PLAN_LIMITS = {
    BillingPlan.FREE: {"max_members": 3, "monthly_seconds": 3_600},       # 1 h/month
    BillingPlan.PRO: {"max_members": 10, "monthly_seconds": 36_000},      # 10 h/month
    BillingPlan.ENTERPRISE: {"max_members": 9999, "monthly_seconds": 9_999_999},
}


# ── Schemas ───────────────────────────────────────────────────────────────────

class StudioIn(BaseModel):
    name: str


class StudioOut(BaseModel):
    id: str
    name: str
    plan: str
    owner_id: str
    member_count: int
    created_at: str

    class Config:
        from_attributes = True


class MemberOut(BaseModel):
    id: str
    email: str
    role: str
    pending: bool
    created_at: str

    class Config:
        from_attributes = True


class InviteIn(BaseModel):
    email: EmailStr
    role: StudioRole = StudioRole.MEMBER


class UpdateMemberIn(BaseModel):
    role: StudioRole


class BillingOut(BaseModel):
    plan: str
    usage_seconds_month: int
    limit_seconds_month: int
    max_members: int
    member_count: int


class JobSummaryOut(BaseModel):
    id: str
    original_filename: str
    status: str
    source_language: str
    target_languages: List[str]
    progress: int
    created_at: str

    class Config:
        from_attributes = True


# ── Helpers ───────────────────────────────────────────────────────────────────

def _studio_or_404(studio_id: str, db: Session) -> Studio:
    studio = db.get(Studio, studio_id)
    if not studio:
        raise HTTPException(404, "Studio not found")
    return studio


def _require_role(studio: Studio, user: User, db: Session, minimum: StudioRole = StudioRole.MEMBER) -> StudioMember:
    """Assert the user is a member of the studio with at least the given role."""
    role_order = [StudioRole.MEMBER, StudioRole.ADMIN, StudioRole.OWNER]
    member = (
        db.query(StudioMember)
        .filter(StudioMember.studio_id == studio.id, StudioMember.user_id == user.id)
        .first()
    )
    if not member:
        # Also let the DB owner access without a membership row
        if studio.owner_id != user.id:
            raise HTTPException(403, "Not a member of this studio")
        return None  # owner has implicit full access
    if role_order.index(member.role) < role_order.index(minimum):
        raise HTTPException(403, "Insufficient role")
    return member


# ── Studio CRUD ───────────────────────────────────────────────────────────────

@router.get("/", response_model=List[StudioOut])
def list_studios(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Return all studios the user owns or is a member of."""
    owned = db.query(Studio).filter(Studio.owner_id == user.id).all()
    member_studio_ids = [
        m.studio_id
        for m in db.query(StudioMember).filter(
            StudioMember.user_id == user.id, StudioMember.pending == False  # noqa: E712
        ).all()
    ]
    member_studios = (
        db.query(Studio).filter(Studio.id.in_(member_studio_ids), Studio.owner_id != user.id).all()
        if member_studio_ids else []
    )
    studios = owned + member_studios
    return [
        StudioOut(
            id=s.id,
            name=s.name,
            plan=s.plan.value,
            owner_id=s.owner_id,
            member_count=len(s.members),
            created_at=s.created_at.isoformat(),
        )
        for s in studios
    ]


@router.post("/", response_model=StudioOut, status_code=201)
def create_studio(body: StudioIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    studio = Studio(name=body.name, owner_id=user.id)
    db.add(studio)
    db.flush()
    # Add the creator as an OWNER member row for consistency
    owner_member = StudioMember(
        studio_id=studio.id,
        user_id=user.id,
        email=user.email,
        role=StudioRole.OWNER,
        pending=False,
    )
    db.add(owner_member)
    db.commit()
    db.refresh(studio)
    return StudioOut(
        id=studio.id,
        name=studio.name,
        plan=studio.plan.value,
        owner_id=studio.owner_id,
        member_count=len(studio.members),
        created_at=studio.created_at.isoformat(),
    )


@router.get("/{studio_id}", response_model=StudioOut)
def get_studio(studio_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db)
    return StudioOut(
        id=studio.id,
        name=studio.name,
        plan=studio.plan.value,
        owner_id=studio.owner_id,
        member_count=len(studio.members),
        created_at=studio.created_at.isoformat(),
    )


@router.put("/{studio_id}", response_model=StudioOut)
def update_studio(
    studio_id: str, body: StudioIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db, minimum=StudioRole.ADMIN)
    studio.name = body.name
    db.commit()
    db.refresh(studio)
    return StudioOut(
        id=studio.id,
        name=studio.name,
        plan=studio.plan.value,
        owner_id=studio.owner_id,
        member_count=len(studio.members),
        created_at=studio.created_at.isoformat(),
    )


@router.delete("/{studio_id}", status_code=204)
def delete_studio(studio_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    studio = _studio_or_404(studio_id, db)
    if studio.owner_id != user.id:
        raise HTTPException(403, "Only the owner can delete a studio")
    db.delete(studio)
    db.commit()


# ── Members ───────────────────────────────────────────────────────────────────

@router.get("/{studio_id}/members", response_model=List[MemberOut])
def list_members(studio_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db)
    return [
        MemberOut(
            id=m.id,
            email=m.email,
            role=m.role.value,
            pending=m.pending,
            created_at=m.created_at.isoformat(),
        )
        for m in studio.members
    ]


@router.post("/{studio_id}/members", response_model=MemberOut, status_code=201)
def invite_member(
    studio_id: str,
    body: InviteIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db, minimum=StudioRole.ADMIN)

    limits = PLAN_LIMITS[studio.plan]
    if len(studio.members) >= limits["max_members"]:
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            f"Member limit ({limits['max_members']}) reached for {studio.plan.value} plan",
        )

    existing = next((m for m in studio.members if m.email == body.email), None)
    if existing:
        raise HTTPException(409, "Member already invited or joined")

    # Resolve user_id if the email is already registered
    invited_user = db.query(User).filter(User.email == body.email).first()
    member = StudioMember(
        studio_id=studio.id,
        user_id=invited_user.id if invited_user else None,
        email=body.email,
        role=body.role,
        pending=invited_user is None,
        invited_by=user.id,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return MemberOut(
        id=member.id,
        email=member.email,
        role=member.role.value,
        pending=member.pending,
        created_at=member.created_at.isoformat(),
    )


@router.patch("/{studio_id}/members/{member_id}", response_model=MemberOut)
def update_member_role(
    studio_id: str,
    member_id: str,
    body: UpdateMemberIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db, minimum=StudioRole.ADMIN)
    member = db.get(StudioMember, member_id)
    if not member or member.studio_id != studio_id:
        raise HTTPException(404, "Member not found")
    if member.role == StudioRole.OWNER:
        raise HTTPException(403, "Cannot change the owner's role")
    member.role = body.role
    db.commit()
    db.refresh(member)
    return MemberOut(
        id=member.id,
        email=member.email,
        role=member.role.value,
        pending=member.pending,
        created_at=member.created_at.isoformat(),
    )


@router.delete("/{studio_id}/members/{member_id}", status_code=204)
def remove_member(
    studio_id: str,
    member_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db, minimum=StudioRole.ADMIN)
    member = db.get(StudioMember, member_id)
    if not member or member.studio_id != studio_id:
        raise HTTPException(404, "Member not found")
    if member.role == StudioRole.OWNER:
        raise HTTPException(403, "Cannot remove the studio owner")
    db.delete(member)
    db.commit()


# ── Jobs ─────────────────────────────────────────────────────────────────────

@router.get("/{studio_id}/jobs", response_model=List[JobSummaryOut])
def list_studio_jobs(
    studio_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db)
    jobs = db.query(DubbingJob).filter(DubbingJob.studio_id == studio_id).order_by(DubbingJob.created_at.desc()).all()
    return [
        JobSummaryOut(
            id=j.id,
            original_filename=j.original_filename,
            status=j.status.value,
            source_language=j.source_language,
            target_languages=json.loads(j.target_languages),
            progress=j.progress,
            created_at=j.created_at.isoformat(),
        )
        for j in jobs
    ]


# ── Billing ───────────────────────────────────────────────────────────────────

@router.get("/{studio_id}/billing", response_model=BillingOut)
def get_billing(
    studio_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    studio = _studio_or_404(studio_id, db)
    _require_role(studio, user, db)
    limits = PLAN_LIMITS[studio.plan]
    return BillingOut(
        plan=studio.plan.value,
        usage_seconds_month=studio.usage_seconds_month,
        limit_seconds_month=limits["monthly_seconds"],
        max_members=limits["max_members"],
        member_count=len(studio.members),
    )


@router.post("/{studio_id}/billing/upgrade", response_model=BillingOut)
def upgrade_plan(
    studio_id: str,
    plan: BillingPlan,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Upgrade billing plan. In production this would integrate with a payment provider."""
    studio = _studio_or_404(studio_id, db)
    if studio.owner_id != user.id:
        raise HTTPException(403, "Only the owner can change the billing plan")
    studio.plan = plan
    db.commit()
    db.refresh(studio)
    limits = PLAN_LIMITS[studio.plan]
    return BillingOut(
        plan=studio.plan.value,
        usage_seconds_month=studio.usage_seconds_month,
        limit_seconds_month=limits["monthly_seconds"],
        max_members=limits["max_members"],
        member_count=len(studio.members),
    )
