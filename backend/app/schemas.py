from datetime import datetime

from pydantic import BaseModel


class MeetingResponse(BaseModel):
    id: int
    title: str
    status: str
    transcript: str | None = None
    minutes: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }