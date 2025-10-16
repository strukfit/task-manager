import { ApiError, ApiResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';
import { Issue, IssueCreate, IssueEdit, IssuesResponse } from '@/schemas/issue';

export type GetIssuesParams = {
  projectId?: number;
};

export const getIssues = async (
  workspaceId: number,
  params?: GetIssuesParams
): Promise<IssuesResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<IssuesResponse>>(
      API_ROUTES.issues.issues(workspaceId),
      { params }
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch issues'
    );
  }
};

export const getIssueById = async (
  workspaceId: number,
  id: number
): Promise<Issue> => {
  try {
    const response = await apiClient.get<ApiResponse<Issue>>(
      `${API_ROUTES.issues.issues(workspaceId)}/${id}`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch issue'
    );
  }
};

export const createIssue = async (
  workspaceId: number,
  issue: IssueCreate
): Promise<Issue> => {
  try {
    const response = await apiClient.post<ApiResponse<Issue>>(
      API_ROUTES.issues.issues(workspaceId),
      issue
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to create issue'
    );
  }
};

export const updateIssue = async (
  workspaceId: number,
  issue: IssueEdit
): Promise<Issue> => {
  try {
    const response = await apiClient.put<ApiResponse<Issue>>(
      `${API_ROUTES.issues.issues(workspaceId)}/${issue.id}`,
      issue
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update issue'
    );
  }
};

export const deleteIssue = async (
  workspaceId: number,
  id: number
): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<Issue>>(
      `${API_ROUTES.issues.issues(workspaceId)}/${id}`
    );
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to delete issue'
    );
  }
};
