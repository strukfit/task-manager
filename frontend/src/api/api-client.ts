import { API_ROUTES, BASE_URL } from '@/constants/api';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !location.pathname.includes('/login') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          API_ROUTES.auth.refresh,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        localStorage.clear();
        location.href = '/login';
        throw error;
      }
    }
    throw error;
  }
);

export default apiClient;
