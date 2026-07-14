This is the place where all the images and scripts are stored. If you are looking for the main application, please visit [here](https://github.com/EXALAB/AnLinux-App)

To open an issue, please visit [here](https://github.com/EXALAB/AnLinux-App/issues)



## Bootstraping System

Note: Only [Ubuntu](https://www.ubuntu.com/), [Debian](https://www.debian.org/), [Kali](https://www.kali.org/), [Parrot Security OS](https://www.parrotsec.org/), [BackBox](https://www.backbox.org) are bootstrap using the script, others are official image without modification.

Script located at Scripts/Bootstrap are used to bootstrap the system.

You will need to install some package first:

> sudo apt-get install qemu-user-static debian-archive-keyring debootstrap

Then go to [Bootstrap](https://github.com/EXALAB/Anlinux-Resources/tree/master/Scripts/Bootstrap) and download the bootstrap.sh script. (It is important to follow instructions before running bootstrap.sh if there any.)

To bootstrap a system, simply run:

> ./bootstrap.sh architecture /path/to/bootstrap
   
For example: 

> ./bootstrap.sh armhf /home/user/ubuntu/armhf
 
## Dubkami Master Blueprint (Approved)

यह सेक्शन AI dubbing app "डुबकामी" के लिए approved end-to-end blueprint को lock करता है।

### Phase 1: Final Master Requirements (Locked)
- Scope: वीडियो और ऑडियो दोनों के लिए AI dubbing.
- Input: click-to-upload और drag-and-drop, प्रति फाइल 5GB तक.
- Duration: long-duration content के लिए asynchronous processing.
- Language: source language select/auto-detect + multiple target languages.
- AI Capabilities: voice synthesis, lip-sync, emotion/tone matching, noise management, speaker differentiation.
- Multi-speaker: speaker-wise voice mapping और consistency controls.
- Output: dubbed audio/video exports, optional subtitles/transcripts.
- Device Compatibility: web-first (desktop + mobile web support).

### Phase 2: System Architecture
- Pipeline: ingestion -> preprocessing -> ASR/diarization -> translation -> TTS/voice generation -> lip-sync -> render/master -> delivery.
- Orchestration: async jobs, queueing, retries, checkpoint-based recovery.
- Storage/Delivery: object storage + resumable uploads + CDN delivery.
- Security: encryption at rest/in transit, access controls, auditability.

### Phase 3: Module-wise Implementation Roadmap
- Module A: media upload + validation + chunked/resumable transfer.
- Module B: transcription + speaker diarization + speaker timeline.
- Module C: translation layer with glossary/style controls.
- Module D: per-speaker voice assignment + synthesis controls.
- Module E: lip-sync and timeline alignment.
- Module F: quality scoring, review tools, and export manager.
- Module G: studio workflow (roles, approvals, versioned outputs).

### Backlog Freeze (MVP vs Phase-2/3)
- MVP:
  - upload, source/target language selection, transcription/translation, per-speaker dubbing, baseline exports, job tracking.
- Phase-2:
  - advanced lip-sync refinement, deeper emotion controls, stronger noise cleanup, batch workflows.
- Phase-3:
  - full studio automation templates, large-scale optimization, advanced analytics and governance.

### QA, Security, Scalability, Rollout
- QA:
  - language-pair regression suite, multi-speaker stress testing, sync/quality benchmark thresholds.
- Security:
  - role-based access, secure media handling, retention policy controls, audit logging.
- Scalability:
  - autoscaled workers (CPU/GPU), queue backpressure handling, resilient retry logic.
- Rollout:
  - pilot -> limited beta -> staged public release by language and region.

## Dubkami Execution Tasks (Autopilot)

### 1) Phase-wise Execution Breakdown
- Workstreams: Product, Platform, AI/ML, Studio UX, QA, Security, Release.
- Tracking model: To Do -> In Progress -> Blocked -> Done.
- Definition of Done (DoD) per task: owner set, dependency resolved, acceptance checks passed, artifact linked.

### 2) Phase-1 Requirements Lock: Issue Checklist
- [ ] Scope freeze approved (audio/video dubbing, file size limits, language support, multi-speaker support).
- [ ] Functional requirements approved (ASR, translation, TTS, lip-sync, emotion matching, noise management).
- [ ] Non-functional requirements approved (reliability, security, observability, throughput targets).
- [ ] Input/output contract approved (upload methods, exports, subtitle/transcript options).
- [ ] Device/browser support matrix approved.
- [ ] Final acceptance criteria signed off by Product, Engineering, and QA.

### 3) Phase-2 Architecture Artifacts
#### Components
- Ingestion Service
- Media Preprocessing Service
- ASR + Speaker Diarization Service
- Translation Service
- Voice Synthesis/TTS Service
- Lip-sync & Alignment Service
- Render/Mastering Service
- Delivery Service (Storage/CDN)
- Orchestration & Job Queue Service

#### Data-flow
- Upload init -> chunk transfer -> upload finalize -> job enqueue.
- Pipeline stages execute asynchronously with checkpoints and retries.
- Intermediate artifacts stored stage-wise; final outputs published via delivery service.
- Failures routed to retry policy; non-recoverable jobs move to manual-review state.

#### APIs (Minimum)
- POST /projects
- POST /jobs
- POST /uploads/init
- POST /uploads/{id}/complete
- GET /jobs/{id}
- POST /jobs/{id}/speaker-mapping
- POST /jobs/{id}/rerender
- GET /exports/{id}

### 4) Phase-3 Backlog Assignment (MVP / Phase-2 / Phase-3)
#### MVP
- Upload + resumable transfer (Platform)
- Source/target language selection (Product/UX)
- Transcription + diarization baseline (AI/ML)
- Basic translation + TTS dubbing (AI/ML)
- Export and job status tracking (Platform/UX)

#### Phase-2
- Advanced lip-sync tuning (AI/ML)
- Emotion/prosody controls (AI/ML + UX)
- Enhanced noise cleanup pipeline (AI/ML)
- Batch project workflows (Platform + UX)

#### Phase-3
- Studio automation templates (Platform)
- Governance/compliance depth (Security + Platform)
- Analytics and operational insights (Platform/Product)

### 5) QA + Security + Rollout Gates
#### QA Gates
- [ ] Language-pair regression suite pass.
- [ ] Multi-speaker consistency tests pass.
- [ ] Sync/alignment threshold pass for release candidate.

#### Security Gates
- [ ] Secret scanning clean.
- [ ] Access-control and audit logging verification complete.
- [ ] Retention policy checks complete.

#### Scalability Gates
- [ ] Large-file upload reliability test pass.
- [ ] Concurrent job processing load test pass.
- [ ] Retry/recovery behavior validated.

#### Rollout Gates
- [ ] Pilot exit criteria met.
- [ ] Beta exit criteria met.
- [ ] Production go/no-go sign-off recorded.
