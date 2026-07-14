This is the place where all the images and scripts are stored. If you are looking for the main application, please visit [here](https://github.com/EXALAB/AnLinux-App)

To open an issue, please visit [here](https://github.com/EXALAB/AnLinux-App/issues)

## Bootstrapping System

Note: Only [Ubuntu](https://www.ubuntu.com/), [Debian](https://www.debian.org/), [Kali](https://www.kali.org/), [Parrot Security OS](https://www.parrotsec.org/), [BackBox](https://www.backbox.org) are bootstrapped using the script; others are official images without modification.

Scripts located at `Scripts/Bootstrap` are used to bootstrap the system.

You will need to install some packages first:

```
sudo apt-get install qemu-user-static debian-archive-keyring debootstrap
```

Then go to [Bootstrap](https://github.com/EXALAB/Anlinux-Resources/tree/master/Scripts/Bootstrap) and download the `bootstrap.sh` script. (Follow any instructions in that directory before running the script.)

To bootstrap a system, run:

```
./bootstrap.sh <architecture> /path/to/bootstrap
```

Example:

```
./bootstrap.sh armhf /home/user/ubuntu/armhf
```

---

## Dubkami

**Dubkami** is an AI-powered dubbing and localization platform for Indian anime and video content. It automates the dubbing pipeline from upload through final export, supporting 50+ languages with per-speaker voice synthesis.

### Core Capabilities

| Component | Technology |
| --- | --- |
| ASR | Whisper / OpenAI — automatic speech recognition |
| Diarization | PyAnnote — multi-speaker detection and timeline |
| Translation | NLLB-200 / DeepL — neural machine translation |
| TTS / Voice Cloning | XTTS-v2 / ElevenLabs — per-speaker voice synthesis |
| Lip-sync | Wav2Lip / SadTalker — timeline alignment (Phase 2) |
| Export | Dubbed audio/video with optional subtitles/transcripts |

### Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Web-first (desktop + mobile), drag-and-drop upload |
| Backend | REST API, async job queue |
| Storage | Object storage + CDN + resumable upload (up to 5 GB) |
| CI/CD | GitHub Actions |
| Security | Encryption at rest/in transit, RBAC, audit logs |
| Orchestration | Async workers, retries, checkpoint recovery |

---

## Dubkami — Master Blueprint

### Phase 1 — Requirements (Locked)

- **Input:** click-to-upload and drag-and-drop; up to 5 GB per file.
- **Processing:** asynchronous pipeline for long-duration content.
- **Language:** source language selection/auto-detect plus multiple target languages.
- **AI capabilities:** voice synthesis, lip-sync, emotion/tone matching, noise management, multi-speaker differentiation.
- **Output:** dubbed audio/video exports; optional subtitles and transcripts.
- **Device support:** web-first (desktop + mobile browsers).

#### Requirements checklist

- [x] Scope freeze approved (audio/video dubbing, file-size limits, language support, multi-speaker).
- [x] Functional requirements approved (ASR, translation, TTS, lip-sync, emotion matching, noise management).
- [x] Non-functional requirements approved (reliability, security, observability, throughput targets).
- [x] Input/output contract approved (upload methods, exports, subtitle/transcript options).
- [x] Device/browser support matrix approved.
- [x] Final acceptance criteria signed off by Product, Engineering, and QA.

### Phase 2 — Architecture

**Pipeline:**
ingestion → preprocessing → ASR/diarization → translation → TTS/voice generation → lip-sync → render/mastering → delivery

**Services:**

- Ingestion Service
- Media Preprocessing Service
- ASR + Speaker Diarization Service
- Translation Service
- Voice Synthesis / TTS Service
- Lip-sync & Alignment Service
- Render / Mastering Service
- Delivery Service (Storage / CDN)
- Orchestration & Job Queue Service

**Data flow:**

1. Upload init → chunk transfer → upload finalize → job enqueue.
2. Pipeline stages execute asynchronously with checkpoints and retries.
3. Intermediate artifacts stored per stage; final outputs published via delivery service.
4. Failures routed to retry policy; non-recoverable jobs move to manual-review state.

**Minimum API surface:**

```
POST /projects
POST /jobs
POST /uploads/init
POST /uploads/{id}/complete
GET  /jobs/{id}
POST /jobs/{id}/speaker-mapping
POST /jobs/{id}/rerender
GET  /exports/{id}
```

**Infrastructure:**

- Object storage + resumable uploads + CDN delivery.
- Encryption at rest and in transit; access controls; audit logging.

### Phase 3 — Module Roadmap

| Module | Scope |
| --- | --- |
| A | Media upload, validation, chunked/resumable transfer |
| B | Transcription, speaker diarization, speaker timeline |
| C | Translation layer with glossary and style controls |
| D | Per-speaker voice assignment and synthesis controls |
| E | Lip-sync and timeline alignment |
| F | Quality scoring, review tools, export manager |
| G | Studio workflow: roles, approvals, versioned outputs |

### Backlog Scope

**MVP**
- Upload + resumable transfer (Platform)
- Source/target language selection (Product/UX)
- Transcription + diarization baseline (AI/ML)
- Basic translation + TTS dubbing (AI/ML)
- Export and job status tracking (Platform/UX)

**Phase 2**
- Advanced lip-sync tuning (AI/ML)
- Emotion/prosody controls (AI/ML + UX)
- Enhanced noise cleanup pipeline (AI/ML)
- Batch project workflows (Platform + UX)

**Phase 3**
- Studio automation templates (Platform)
- Governance/compliance depth (Security + Platform)
- Analytics and operational insights (Platform/Product)

---

## Dubkami — Execution Schedule

Active sprint: **Week 4 — MVP Sprint 2**

| Week | Milestone | Deliverables |
| --- | --- | --- |
| 1 | Phase-1 Lock | Scope + functional/non-functional requirements sign-off; device/browser matrix; acceptance criteria freeze |
| 2 | Architecture Artifacts | Components diagram; data-flow + failure/retry model; API contract v1 |
| 3 | MVP Sprint 1 | Upload + resumable transfer; project/job creation + status tracking; storage integration baseline |
| 4 | MVP Sprint 2 | ASR + speaker diarization baseline; source/target language flow; basic translation pipeline |
| 5 | MVP Sprint 3 | TTS dubbing per speaker; export pipeline (audio/video); first end-to-end integration |
| 6 | MVP Hardening | Bug fixes + quality tuning; multi-speaker consistency; release candidate cut |
| 7 | Gates Validation | QA gates; security gates; scalability smoke/load checks |
| 8 | Pilot Rollout | Pilot launch; feedback triage + fixes; beta go/no-go decision |

### Sprint Status

**Week 1 — Phase-1 Lock: Complete**
- [x] Scope + functional + non-functional requirements sign-off *(Product Lead)*
- [x] Device/browser support matrix sign-off *(QA Lead)*
- [x] Final acceptance criteria freeze *(Product + Engineering + QA)*

**Week 2 — Architecture Artifacts: Complete**
- [x] Components diagram final *(Tech Lead)*
- [x] Data-flow + failure/retry model final *(Tech Lead)*
- [x] API contract v1 freeze *(Backend Lead)*

**Week 3 — MVP Sprint 1: Complete**
- [x] Upload + resumable transfer *(Platform Engineer)*
- [x] Project/job creation + status tracking *(Backend Engineer)*
- [x] Storage integration baseline *(Platform Engineer)*

**Week 4 — MVP Sprint 2: In Progress**
- [ ] ASR + speaker diarization baseline *(ML Lead)*
- [ ] Source/target language flow *(NLP Engineer)*
- [ ] Basic translation pipeline *(NLP Engineer)*

**Week 5 — MVP Sprint 3: Upcoming**
- [ ] TTS dubbing per speaker *(Speech Engineer)*
- [ ] Export pipeline (audio/video) *(Media Pipeline Engineer)*
- [ ] First end-to-end integration *(Eng Team)*

---

## Dubkami — QA / Security / Rollout Gates

### QA Gates

- [ ] Language-pair regression suite pass.
- [ ] Multi-speaker consistency tests pass.
- [ ] Sync/alignment threshold pass for release candidate.

### Security Gates

- [ ] Secret scanning clean.
- [ ] Access-control and audit logging verification complete.
- [ ] Retention policy checks complete.

### Scalability Gates

- [ ] Large-file upload reliability test pass.
- [ ] Concurrent job processing load test pass.
- [ ] Retry/recovery behavior validated.

### Rollout Gates

- [ ] Pilot exit criteria met.
- [ ] Beta exit criteria met.
- [ ] Production go/no-go sign-off recorded.

---

## Dubkami — Task Owner / Priority / Status Board

| Week | Track | Owner | Priority | Status | Deliverables |
| --- | --- | --- | --- | --- | --- |
| 1 | Product | Product Lead | P0 | ✅ Done | Scope and acceptance criteria lock |
| 1 | QA | QA Lead | P0 | ✅ Done | Device/browser matrix sign-off |
| 2 | Platform | Tech Lead | P0 | ✅ Done | Components/data-flow/failure-retry artifacts |
| 2 | API | Backend Lead | P0 | ✅ Done | API contract v1 freeze |
| 3 | Platform | Platform Engineer | P0 | ✅ Done | Upload + resumable transfer + storage baseline |
| 3 | Workflow | Backend Engineer | P0 | ✅ Done | Project/job creation and tracking |
| 4 | AI/ML | ML Lead | P0 | 🔄 In Progress | ASR + diarization baseline |
| 4 | AI/ML | NLP Engineer | P0 | 🔄 In Progress | Source/target language flow + translation baseline |
| 5 | AI/ML | Speech Engineer | P0 | ⏳ To Do | TTS dubbing per speaker |
| 5 | Platform | Media Pipeline Engineer | P0 | ⏳ To Do | Export pipeline + end-to-end integration |
| 6 | Engineering | Eng Team | P0 | ⏳ To Do | Bug fixes + quality tuning |
| 6 | AI/ML | ML Team | P1 | ⏳ To Do | Multi-speaker consistency improvements |
| 7 | QA | QA Team | P0 | ⏳ To Do | QA gates execution |
| 7 | Security | Security Lead | P0 | ⏳ To Do | Security gates execution |
| 7 | Platform | SRE/Platform Team | P1 | ⏳ To Do | Scalability smoke/load checks |
| 8 | Release | Release Manager | P0 | ⏳ To Do | Pilot launch and feedback triage |
| 8 | Product | Product + Leadership | P0 | ⏳ To Do | Beta go/no-go decision |

**Status legend:** ✅ Done | 🔄 In Progress | ⏳ To Do | 🚫 Blocked
