import { ApiError, ApiResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';
import {
  Workspace,
  WorkspaceCreate,
  WorkspacesResponse,
  WorkspaceEdit,
} from '@/schemas/workspace';

export const getWorkspaces = async (): Promise<WorkspacesResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<WorkspacesResponse>>(
      API_ROUTES.workspaces.workspaces
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch workspaces'
    );
  }
};

export const getWorkspaceById = async (id: number): Promise<Workspace> => {
  try {
    const response = await apiClient.get<ApiResponse<Workspace>>(
      `${API_ROUTES.workspaces.workspaces}/${id}`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch workspace'
    );
  }
};

export const createWorkspace = async (
  workspace: WorkspaceCreate
): Promise<Workspace> => {
  try {
    const response = await apiClient.post<ApiResponse<Workspace>>(
      API_ROUTES.workspaces.workspaces,
      workspace
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to create workspace'
    );
  }
};

export const updateWorkspace = async (
  workspace: WorkspaceEdit
): Promise<Workspace> => {
  try {
    const response = await apiClient.put<ApiResponse<Workspace>>(
      `${API_ROUTES.workspaces.workspaces}/${workspace.id}`,
      workspace
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update workspace'
    );
  }
};

export const deleteWorkspace = async (id: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<Workspace>>(
      `${API_ROUTES.workspaces.workspaces}/${id}`
    );
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch workspace'
    );
  }
};
