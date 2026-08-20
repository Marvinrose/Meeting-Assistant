import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export async function getMeetings() {
  const response = await axios.get(`${API_URL}/meetings/`);
  return response.data;
}

export async function createMeeting(title, audioFile) {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('audio', audioFile);

  const response = await axios.post(
    `${API_URL}/meetings/`,
    formData,
  );

  return response.data;
}