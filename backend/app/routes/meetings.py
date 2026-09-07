from pathlib import Path
from tempfile import NamedTemporaryFile
import os

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting
from ..schemas import MeetingResponse

from ..services.storage import (
    upload_audio,
    download_audio,
    create_audio_signed_url,
    delete_audio,
)

from ..services.transcription import transcribe_audio
from ..services.minutes import generate_minutes
from ..services.documents import generate_docx, generate_pdf


router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"],
)


ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".m4a",
    ".mp4",
    ".webm",
    ".ogg",
}


@router.post("/", response_model=MeetingResponse)
async def create_meeting(
    title: str = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not audio.filename:
        raise HTTPException(
            status_code=400,
            detail="Audio file is required.",
        )

    extension = Path(audio.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format.",
        )

    contents = await audio.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded audio file is empty.",
        )

    try:
        # Upload the recording to Supabase Storage.
        storage_path = upload_audio(
            file_bytes=contents,
            original_filename=audio.filename,
            content_type=audio.content_type,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload audio: {str(exc)}",
        )

    # Store the Supabase Storage path in PostgreSQL.
    meeting = Meeting(
        title=title,
        audio_filename=storage_path,
        status="uploaded",
    )

    try:
        db.add(meeting)
        db.commit()
        db.refresh(meeting)

    except Exception:
        # If the database fails after the Storage upload,
        # remove the orphaned recording.
        try:
            delete_audio(storage_path)
        except Exception:
            pass

        raise

    return meeting


@router.get("/", response_model=list[MeetingResponse])
def get_meetings(
    db: Session = Depends(get_db),
):
    return (
        db.query(Meeting)
        .order_by(Meeting.created_at.desc())
        .all()
    )


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found.",
        )

    return meeting


@router.delete("/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found.",
        )

    # Delete recording from Supabase Storage.
    if meeting.audio_filename:
        try:
            delete_audio(meeting.audio_filename)
        except Exception as exc:
            print(
                f"Warning: failed to delete audio from Supabase: {exc}"
            )

    db.delete(meeting)
    db.commit()

    return {
        "message": "Meeting deleted successfully."
    }


@router.get("/{meeting_id}/audio")
def play_audio(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found.",
        )

    if not meeting.audio_filename:
        raise HTTPException(
            status_code=404,
            detail="No audio recording found.",
        )

    try:
        signed_url = create_audio_signed_url(
            meeting.audio_filename
        )

    except Exception as exc:
        raise HTTPException(
            status_code=404,
            detail=f"Unable to access audio recording: {str(exc)}",
        )

    return RedirectResponse(
        url=signed_url
    )


@router.post("/{meeting_id}/process")
def process_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found.",
        )

    if not meeting.audio_filename:
        raise HTTPException(
            status_code=400,
            detail="Meeting has no audio file.",
        )

    temporary_file_path = None

    try:
        meeting.status = "processing"
        db.commit()

        # Download the recording from Supabase.
        audio_data = download_audio(
            meeting.audio_filename
        )

        if not audio_data:
            raise RuntimeError(
                "Downloaded audio file is empty."
            )

        # Keep the file temporarily on the Render server
        # while the transcription service processes it.
        extension = Path(
            meeting.audio_filename
        ).suffix

        with NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temporary_file:
            temporary_file.write(audio_data)
            temporary_file_path = temporary_file.name

        # Transcribe the recording.
        transcript = transcribe_audio(
            temporary_file_path
        )

        meeting.transcript = transcript

        # Generate meeting minutes.
        minutes = generate_minutes(
            meeting.title,
            transcript,
        )

        meeting.minutes = minutes

        # Generate downloadable documents.
        generate_docx(
            meeting.id,
            meeting.title,
            minutes,
        )

        generate_pdf(
            meeting.id,
            meeting.title,
            minutes,
        )

        meeting.status = "completed"

        db.commit()
        db.refresh(meeting)

        return meeting

    except Exception as exc:
        db.rollback()

        meeting.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(exc)}",
        )

    finally:
        # Remove the temporary recording after processing.
        if temporary_file_path:
            try:
                os.remove(temporary_file_path)
            except OSError:
                pass


@router.get("/{meeting_id}/document/pdf")
def download_pdf(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found.",
        )

    path = Path(
        f"generated/meeting-{meeting_id}.pdf"
    )

    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF has not been generated yet.",
        )

    return FileResponse(
        path,
        media_type="application/pdf",
        filename=f"{meeting.title}.pdf",
    )

@router.get("/{meeting_id}/document/docx")
def download_docx(meeting_id: int, db: Session = Depends(get_db)):
    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found.",
        )

    path = Path(
        f"generated/meeting-{meeting_id}.docx"
    )

    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail="DOCX has not been generated yet.",
        )

    return FileResponse(
        path,
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        ),
        filename=f"{meeting.title}.docx",
    )