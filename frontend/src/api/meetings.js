import axios from 'axios';

// Use the environment variable when available.
// During local development, this falls back to FastAPI.
const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000/api';

export async function getMeetings() {
  const response = await axios.get(
    `${API_URL}/meetings/`
  );

  return response.data;
}

export async function getMeeting(id) {
  const response = await axios.get(
    `${API_URL}/meetings/${id}`
  );

  return response.data;
}

export async function createMeeting(title, audioFile) {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('audio', audioFile);

  const response = await axios.post(
    `${API_URL}/meetings/`,
    formData
  );

  return response.data;
}

export async function deleteMeeting(id) {
  const response = await axios.delete(
    `${API_URL}/meetings/${id}`
  );

  return response.data;
}

// Transcribe the meeting and generate minutes.
export async function processMeeting(id) {
  const response = await axios.post(
    `${API_URL}/meetings/${id}/process`
  );

  return response.data;
}

// Return the PDF URL for a meeting.
export function getMeetingPdfUrl(id) {
  return `${API_URL}/meetings/${id}/document/pdf`;
}