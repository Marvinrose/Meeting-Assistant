import os
import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting

router = APIRouter(
    prefix="/api/meetings",
    tags=["Meetings"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/")
async def create_meeting(
    title: str = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    file_extension = Path(audio.filename or "").suffix

    filename = f"{title.replace(' ', '_')}_{audio.filename}"

    file_path = UPLOAD_DIR / filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    meeting = Meeting(
        title=title,
        audio_path=str(file_path),
        status="uploaded",
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting


@router.get("/")
def get_meetings(
    db: Session = Depends(get_db),
):
    meetings = (
        db.query(Meeting)
        .order_by(Meeting.created_at.desc())
        .all()
    )

    return meetings


@router.get("/{meeting_id}")
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    return db.query(Meeting).filter(
        Meeting.id == meeting_id
    ).first()