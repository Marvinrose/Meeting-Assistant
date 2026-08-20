from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MeetingResponse(BaseModel):
    id: int
    title: str
    audio_filename: str | None
    transcript: str | None
    minutes: str | None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)