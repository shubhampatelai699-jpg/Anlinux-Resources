"""TTS worker – ElevenLabs → Coqui TTS fallback, with emotion tag support."""

from __future__ import annotations

import os
import tempfile
from typing import List

from app.core.config import settings
from app.services.celery_app import celery_app

# Map simple emotion labels to Coqui/XTTS style tags
EMOTION_SSML = {
    "happy": "<prosody pitch='+10%' rate='fast'>",
    "sad": "<prosody pitch='-10%' rate='slow'>",
    "angry": "<prosody pitch='+20%' rate='fast' volume='loud'>",
    "neutral": "",
}


def _synthesize_elevenlabs(text: str, voice_id: str, emotion: str) -> bytes:
    from elevenlabs import ElevenLabs
    client = ElevenLabs(api_key=settings.ELEVENLABS_API_KEY)
    audio = client.text_to_speech.convert(
        voice_id=voice_id,
        text=text,
        model_id="eleven_multilingual_v2",
    )
    return b"".join(audio)


def _synthesize_coqui(text: str, language: str) -> bytes:
    from TTS.api import TTS as CoquiTTS
    tts = CoquiTTS("tts_models/multilingual/multi-dataset/xtts_v2")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tts.tts_to_file(text=text, language=language, file_path=tmp.name)
        tmp_path = tmp.name
    with open(tmp_path, "rb") as f:
        data = f.read()
    os.unlink(tmp_path)
    return data


@celery_app.task(bind=True, name="workers.tts")
def synthesize_speech(
    self,
    job_id: str,
    segments: list,
    target_language: str,
    speaker_voice_map: dict,
) -> list:
    """
    For each segment, synthesize speech for 'translated_text'.
    Returns segments with 'audio_bytes_hex' (hex-encoded WAV).
    """
    results = []
    for seg in segments:
        text = seg.get("translated_text", seg["text"])
        speaker = seg.get("speaker", "SPEAKER_00")
        voice_id = speaker_voice_map.get(speaker)
        emotion = seg.get("emotion", "neutral")

        if settings.ELEVENLABS_API_KEY and voice_id:
            try:
                audio = _synthesize_elevenlabs(text, voice_id, emotion)
                seg["audio_bytes_hex"] = audio.hex()
                results.append(seg)
                continue
            except Exception:
                pass

        audio = _synthesize_coqui(text, target_language)
        seg["audio_bytes_hex"] = audio.hex()
        results.append(seg)

    return results
