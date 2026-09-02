## Meeting Assistant

Meeting Assistant is being developed as a practical full-stack application that simplifies the process of turning recorded meetings into structured, professional meeting minutes.

## 🚀 Live Demo

Live Application: https://meeting-assistant-delta-five.vercel.app

API Documentation (Swagger): https://meeting-assistant-27d5.onrender.com/docs

## ✨ Features
- Create and manage meetings
- Add meeting titles
- Upload existing audio/video recordings
- Record meetings directly from the browser
- Store meeting recordings securely
- View meeting details
- Play meeting recordings
- Generate meeting transcripts
- Generate professional meeting minutes
- Download meeting minutes as PDF
- Responsive interface for desktop and mobile

## 🛠️ Tech Stack
### Frontend
- React
- JavaScript
- Vite
- Material UI (MUI)
- Axios
- React Router
### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Uvicorn
### Database & Storage
- Supabase PostgreSQL
- Supabase Storage
### Deployment
- Vercel — Frontend
- Render — Backend API
- Supabase — Database and file storage

### ⚙️ Running the Project Locally
#### 1. Clone the repository
git clone <your-repository-url>
cd meeting-assistant
#### 2. Frontend Setup
cd frontend
npm install
npm run dev

The frontend will normally be available at:

http://localhost:5173

Create a .env file in the frontend directory:
VITE_API_URL=http://127.0.0.1:8000/api

#### 3. Backend Setup

Open another terminal:
cd backend
Create and activate a virtual environment.
##### Windows
python -m venv venv
venv\Scripts\activate
Install dependencies:
pip install -r requirements.txt

Create a .env file inside backend:

DATABASE_URL=your_database_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
SUPABASE_STORAGE_BUCKET=your_storage_bucket

Start the FastAPI server:
python -m uvicorn app.main:app --reload

The API will be available at:
http://127.0.0.1:8000

Swagger API documentation:
http://127.0.0.1:8000/docs

#### This project is currently under active development, with the transcription and AI-generated meeting minutes pipeline being finalized..
