import { TaskResponse } from '@/schemas/task';
import { ApiError, ApiResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';

export const getTasks = async (): Promise<TaskResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<TaskResponse>>(
      API_ROUTES.tasks
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch tasks'
    );
  }
};
