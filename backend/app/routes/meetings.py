from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting
from ..schemas import MeetingResponse


router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post(
    "/",
    response_model=MeetingResponse,
)
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

    allowed_extensions = {
        ".mp3",
        ".wav",
        ".m4a",
        ".mp4",
        ".webm",
        ".ogg",
    }

    if extension not in allowed_extensions:
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


@router.get(
    "/",
    response_model=list[MeetingResponse],
)
def get_meetings(
    db: Session = Depends(get_db),
):
    return (
        db.query(Meeting)
        .order_by(Meeting.created_at.desc())
        .all()
    )


@router.get(
    "/{meeting_id}",
    response_model=MeetingResponse,
)
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