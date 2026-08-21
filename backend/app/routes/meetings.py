from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting
from ..schemas import MeetingResponse

from ..services.transcription import transcribe_audio
from ..services.minutes import generate_minutes
from ..services.documents import generate_docx, generate_pdf


router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


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

    filename = f"{uuid4()}{extension}"
    file_path = UPLOAD_DIR / filename

    contents = await audio.read()

    with open(file_path, "wb") as file:
        file.write(contents)

    meeting = Meeting(
        title=title,
        audio_filename=filename,
        status="uploaded",
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

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

    if meeting.audio_filename:
        file_path = UPLOAD_DIR / meeting.audio_filename

        if file_path.exists():
            file_path.unlink()

    db.delete(meeting)
    db.commit()

    return {
        "message": "Meeting deleted successfully."
    }


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

    audio_path = Path("uploads") / meeting.audio_filename

    if not audio_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Audio file not found.",
        )

    try:
        meeting.status = "processing"
        db.commit()

        transcript = transcribe_audio(
            str(audio_path)
        )

        meeting.transcript = transcript

        minutes = generate_minutes(
            meeting.title,
            transcript,
        )

        meeting.minutes = minutes

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
            detail=str(exc),
        )


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