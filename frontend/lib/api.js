import axios from 'axios';

// Axios instance pointing to FastAPI backend
const API_BASE = 'http://localhost:8000';

export const predictDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  const response = await axios.post(`${API_BASE}/predict`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
  // Returns: { predicted_class, confidence, all_scores }
};

export const getClasses = async () => {
  const response = await axios.get(`${API_BASE}/classes`);
  return response.data;
};

export const healthCheck = async () => {
  const response = await axios.get(`${API_BASE}/`);
  return response.data;
};
