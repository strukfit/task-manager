import { ApiError, ApiResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';
import { ChangePasswordData, EditProfileData, User } from '@/schemas/user';

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ROUTES.users.profile
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch user profile'
    );
  }
};

export const updateUserProfile = async (
  data: EditProfileData
): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ROUTES.users.profile,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update user profile'
    );
  }
};

export const changeUserPassword = async (
  data: ChangePasswordData
): Promise<User> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ROUTES.users.password,
      data
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update user profile'
    );
  }
};
