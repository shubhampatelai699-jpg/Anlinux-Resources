"""FastAPI application factory."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, jobs, speakers, studios
from app.core.config import settings
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dubkami API",
    version="1.0.0",
    description="AI-powered dubbing platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(speakers.router, prefix="/api/speakers", tags=["speakers"])
app.include_router(studios.router, prefix="/api/studios", tags=["studios"])


@app.get("/healthz")
def health() -> dict:
    return {"status": "ok"}
