import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/library';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const registerUser = (userData) => {
  return apiClient.post('/users/register', userData);
};

export const loginUser = (userData) => {
  return apiClient.post('/users/login', userData);
};
