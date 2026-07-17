# Dubkami – AI Dubbing Application

Dubkami is a full-stack AI dubbing platform that automatically dubs audio and video content into multiple languages while preserving the original speaker voices, lip-sync, emotional tone, and background audio.

---

## Architecture

```
┌─────────────┐    presigned POST     ┌───────────┐
│  Next.js    │ ──────────────────▶  │  MinIO /  │
│  Frontend   │                       │  S3       │
│  (port 3000)│ ◀── SSE stream ──    └───────────┘
└──────┬──────┘                             ▲
       │ REST / Auth                        │ download
       ▼                                    │
┌─────────────┐   Celery tasks   ┌──────────┴──────┐
│  FastAPI    │ ──────────────▶ │  Worker (GPU)   │
│  Backend    │                  │  ─ Whisper STT  │
│  (port 8000)│                  │  ─ Diarization  │
└──────┬──────┘                  │  ─ Translation  │
       │                         │  ─ TTS          │
       ▼                         │  ─ Lip-sync     │
┌─────────────┐                  │  ─ Audio mix    │
│  PostgreSQL │                  └─────────────────┘
│  (metadata) │
└─────────────┘
```

---

## Quick Start (Docker Compose)

### Prerequisites
- Docker ≥ 24 with Compose V2
- (Optional) NVIDIA Container Toolkit for GPU acceleration

```bash
cd dubkami

# 1. Copy and edit the environment file
cp backend/.env.example backend/.env

# 2. Build and start all services
docker compose up --build

# 3. Open the app
open http://localhost:3000
```

The MinIO console is available at http://localhost:9001 (user: `minioadmin`, pass: `minioadmin`).

---

## Local Development

### Backend

```bash
cd dubkami/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Start the API
uvicorn app.main:app --reload --port 8000

# Start the Celery worker (separate terminal)
celery -A app.services.celery_app worker --loglevel=info
```

### Frontend

```bash
cd dubkami/frontend
npm install
npm run dev          # http://localhost:3000
```

---

## Key Features

| Feature | Details |
|---|---|
| Upload | Click-to-upload & drag-and-drop; audio + video; up to **5 GB** |
| STT | OpenAI Whisper (local) – model size configurable |
| Speaker diarization | pyannote.audio – automatic multi-speaker detection |
| Translation | DeepL (if key set) → Google Translate fallback |
| TTS | ElevenLabs (if key set) → Coqui XTTS v2 fallback |
| Lip-sync | Wav2Lip for video dubbing |
| Background preservation | Demucs source separation + FFmpeg audio mixing |
| Output | MP4/MKV (video) or MP3/WAV (audio) with time-limited download URLs |
| Real-time status | Server-Sent Events stream |
| i18n | 48 languages; RTL support (Arabic, Hebrew, Persian, Urdu) |
| Auth | JWT-based register/login |
| Infrastructure | Docker Compose (dev) + Kubernetes with GPU HPA (prod) |

---

## Project Structure

```
dubkami/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (auth, jobs, speakers)
│   │   ├── core/         # config, database, security
│   │   ├── models/       # SQLAlchemy ORM models
│   │   ├── services/     # S3 storage, Celery app factory
│   │   └── workers/      # Celery tasks (stt, diarization, translation,
│   │                     #               tts, lipsync, audio_mix, pipeline)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/   # FileUpload, LanguageSelector, JobProgress,
│   │   │                 # SpeakerConfirmation
│   │   ├── pages/        # index.tsx, job/[id].tsx
│   │   └── lib/          # api.ts (axios), constants.ts (languages)
│   ├── public/locales/   # i18n strings (en, hi, ar, zh, es, fr, de…)
│   ├── Dockerfile
│   └── package.json
├── k8s/
│   ├── api-deployment.yaml
│   ├── worker-deployment.yaml   # includes GPU tolerations + HPA
│   ├── frontend-deployment.yaml # includes Ingress + TLS
│   └── secrets.yaml.example
└── docker-compose.yml
```

---

## Environment Variables

See `backend/.env.example` for all configurable variables. Key ones:

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing secret – **change in production** |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis URL for Celery broker |
| `S3_*` | Object storage credentials (works with MinIO, AWS S3, etc.) |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS key (optional; falls back to Coqui) |
| `DEEPL_API_KEY` | DeepL translation key (optional; falls back to Google) |
| `WHISPER_MODEL` | Whisper model size: `tiny`, `base`, `small`, `medium`, `large` |

---

## Adding a New Language

1. Add the language code and name to `frontend/src/lib/constants.ts` → `LANGUAGES`.
2. Create `frontend/public/locales/<code>/common.json` with translated strings.
3. Add the code to `frontend/next-i18next.config.js` → `locales` array.
4. If RTL, add the code to the `rtl` check in `frontend/src/pages/index.tsx`.

---

## Production Deployment (Kubernetes)

```bash
# 1. Copy and fill in secrets
cp k8s/secrets.yaml.example k8s/secrets.yaml
# Edit k8s/secrets.yaml with real values

kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

Workers auto-scale via the `HorizontalPodAutoscaler` based on the `celery_queue_length` external metric (configure your metrics adapter, e.g. KEDA).
