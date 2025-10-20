import { ApiError, ApiResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';
import {
  AuthResponse,
  LoginCreditentials,
  RequestPasswordResetCreditentials,
  ResetPasswordCreditentials,
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

export const requestPasswordReset = async (
  creditentials: RequestPasswordResetCreditentials
) => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ROUTES.auth.requestPasswordReset,
      creditentials
    );
    return response.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to request password reset'
    );
  }
};

export const resetPassword = async (
  creditentials: ResetPasswordCreditentials
) => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      API_ROUTES.auth.resetPassword,
      creditentials
    );
    return response.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to reset password'
    );
  }
};
