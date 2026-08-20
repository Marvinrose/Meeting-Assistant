from fastapi import FastAPI

from .database import Base, engine
from .routes.meetings import router as meetings_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Meeting Assistant API",
    description="API for recording, transcribing and generating meeting minutes.",
    version="0.1.0",
)


app.include_router(meetings_router)


@app.get("/")
def root():
    return {
        "message": "Meeting Assistant API is running."
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }