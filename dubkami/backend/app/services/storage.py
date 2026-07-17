"""S3-compatible object storage service."""

from __future__ import annotations

import boto3
from botocore.config import Config

from app.core.config import settings

_s3 = None


def _client():
    global _s3
    if _s3 is None:
        kwargs = dict(
            region_name=settings.S3_REGION,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            config=Config(signature_version="s3v4"),
        )
        if settings.S3_ENDPOINT_URL:
            kwargs["endpoint_url"] = settings.S3_ENDPOINT_URL
        _s3 = boto3.client("s3", **kwargs)
    return _s3


def generate_presigned_upload(job_id: str, filename: str, content_type: str) -> dict:
    """Return a presigned POST dict for direct browser-to-S3 upload."""
    key = f"input/{job_id}/{filename}"
    response = _client().generate_presigned_post(
        Bucket=settings.S3_BUCKET_INPUT,
        Key=key,
        Fields={"Content-Type": content_type},
        Conditions=[
            {"Content-Type": content_type},
            ["content-length-range", 1, settings.MAX_UPLOAD_BYTES],
        ],
        ExpiresIn=3600,
    )
    return {"url": response["url"], "fields": response["fields"], "key": key}


def generate_presigned_download(s3_key: str, bucket: str = settings.S3_BUCKET_OUTPUT) -> str:
    """Return a time-limited download URL."""
    return _client().generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": s3_key},
        ExpiresIn=settings.S3_PRESIGN_EXPIRY,
    )


def head_object(s3_key: str, bucket: str = settings.S3_BUCKET_INPUT) -> dict:
    return _client().head_object(Bucket=bucket, Key=s3_key)
