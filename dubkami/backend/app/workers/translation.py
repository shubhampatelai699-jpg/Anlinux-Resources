"""Translation worker – DeepL → Google Translate → deep-translator fallback."""

from __future__ import annotations

from typing import List

from app.core.config import settings
from app.services.celery_app import celery_app


def _translate_deepl(texts: List[str], source_lang: str, target_lang: str) -> List[str]:
    import deepl
    translator = deepl.Translator(settings.DEEPL_API_KEY)
    results = translator.translate_text(texts, source_lang=source_lang.upper(), target_lang=target_lang.upper())
    return [r.text for r in results]


def _translate_google(texts: List[str], source_lang: str, target_lang: str) -> List[str]:
    from deep_translator import GoogleTranslator
    translator = GoogleTranslator(source=source_lang, target=target_lang)
    return [translator.translate(t) for t in texts]


def translate_batch(texts: List[str], source_lang: str, target_lang: str) -> List[str]:
    if settings.DEEPL_API_KEY:
        try:
            return _translate_deepl(texts, source_lang, target_lang)
        except Exception:
            pass
    return _translate_google(texts, source_lang, target_lang)


@celery_app.task(bind=True, name="workers.translation")
def translate_segments(
    self,
    job_id: str,
    segments: list,
    source_language: str,
    target_language: str,
) -> list:
    """Translate every segment text; return segments with 'translated_text' field."""
    texts = [seg["text"] for seg in segments]
    translated = translate_batch(texts, source_language, target_language)
    for seg, t in zip(segments, translated):
        seg["translated_text"] = t
    return segments
