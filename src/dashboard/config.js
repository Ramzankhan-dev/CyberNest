export const BASE_URL = 'https://prenatal-unpleased-unplug.ngrok-free.dev';

export const getToken = () => localStorage.getItem('token');

export const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
});