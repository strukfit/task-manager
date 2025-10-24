import { API_ROUTES, BASE_URL } from '@/constants/api';
import { storage } from '@/lib/storage';
import { AuthResponse } from '@/schemas/auth';
import { ApiResponse } from '@/types/common';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = storage.getItem('accessToken');
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
        const refreshToken = storage.getItem('refreshToken');
        const response = await axios.post<ApiResponse<AuthResponse>>(
          `${BASE_URL}${API_ROUTES.auth.refresh}`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        console.log(response);
        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        storage.clear();
        location.href = '/login';
        throw error;
      }
    }
    throw error;
  }
);

export default apiClient;
