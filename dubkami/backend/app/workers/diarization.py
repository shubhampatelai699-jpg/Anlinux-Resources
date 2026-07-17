"""Speaker diarization worker using pyannote.audio."""

from __future__ import annotations

from typing import List

from app.services.celery_app import celery_app


@celery_app.task(bind=True, name="workers.diarization")
def diarize(self, job_id: str, audio_path: str, segments: list) -> dict:
    """
    Run speaker diarization on the audio file and map each transcript
    segment to a speaker label (SPEAKER_00, SPEAKER_01, …).
    """
    try:
        from pyannote.audio import Pipeline
        pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1")
        diarization = pipeline(audio_path)
    except Exception as exc:
        # Fallback: assign single speaker
        for seg in segments:
            seg["speaker"] = "SPEAKER_00"
        return {"segments": segments, "speakers": ["SPEAKER_00"], "error": str(exc)}

    def _speaker_at(start: float, end: float) -> str:
        mid = (start + end) / 2
        for turn, _, label in diarization.itertracks(yield_label=True):
            if turn.start <= mid <= turn.end:
                return label
        return "SPEAKER_00"

    speakers: set = set()
    for seg in segments:
        label = _speaker_at(seg["start"], seg["end"])
        seg["speaker"] = label
        speakers.add(label)

    return {"segments": segments, "speakers": sorted(speakers)}
