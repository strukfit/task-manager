import { ApiError, ApiResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';
import {
  AuthResponse,
  LoginCreditentials,
  SignupCreditentials,
} from '@/schemas/auth';

export const login = async (creditentials: LoginCreditentials) => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.auth.login,
      creditentials
    );
    return response.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(axiosError.response?.data?.message || 'Failed to login');
  }
};

export const signup = async (creditentials: SignupCreditentials) => {
  try {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.auth.signup,
      creditentials
    );
    return response.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(axiosError.response?.data?.message || 'Failed to login');
  }
};
