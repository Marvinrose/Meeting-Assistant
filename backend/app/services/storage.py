import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client


load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY"
)

BUCKET_NAME = "meeting-audio"


if not SUPABASE_URL:
    raise RuntimeError(
        "SUPABASE_URL is not configured."
    )

if not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError(
        "SUPABASE_SERVICE_ROLE_KEY is not configured."
    )


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)


def upload_audio(
    file_bytes: bytes,
    original_filename: str,
    content_type: str | None = None,
) -> str:
    """
    Upload an audio/video file to Supabase Storage.

    Returns the storage path of the uploaded file.
    """

    extension = Path(
        original_filename
    ).suffix.lower()

    unique_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    storage_path = (
        f"meetings/{unique_filename}"
    )

    file_options = {
        "upsert": "false",
    }

    if content_type:
        file_options["content-type"] = content_type

    supabase.storage.from_(
        BUCKET_NAME
    ).upload(
        storage_path,
        file_bytes,
        file_options,
    )

    return storage_path


def download_audio(
    storage_path: str,
) -> bytes:
    """
    Download a meeting recording from
    Supabase Storage.
    """

    response = (
        supabase.storage
        .from_(BUCKET_NAME)
        .download(storage_path)
    )

    return response


def create_audio_signed_url(
    storage_path: str,
    expires_in: int = 3600,
) -> str:
    """
    Create a temporary signed URL for
    playing/downloading a private recording.
    """

    response = (
        supabase.storage
        .from_(BUCKET_NAME)
        .create_signed_url(
            storage_path,
            expires_in,
        )
    )

    if isinstance(response, dict):
        signed_url = (
            response.get("signedURL")
            or response.get("signedUrl")
        )

        if signed_url:
            return signed_url

    raise RuntimeError(
        "Unable to create signed audio URL."
    )


def delete_audio(
    storage_path: str,
) -> None:
    """
    Delete a meeting recording from
    Supabase Storage.
    """

    (
        supabase.storage
        .from_(BUCKET_NAME)
        .remove([storage_path])
    )