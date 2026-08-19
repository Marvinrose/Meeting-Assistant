from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.meetings import router as meetings_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meeting Assistant API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings_router)


@app.get("/")
def root():
    return {
        "message": "Meeting Assistant API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }