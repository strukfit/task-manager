import { ApiError, ApiResponse, PaginatedResponse } from '@/types/common';
import apiClient from './api-client';
import { API_ROUTES } from '@/constants/api';
import {
  Project,
  ProjectCreate,
  ProjectEdit,
  ProjectsResponse,
} from '@/schemas/project';

export const getProjects = async (
  workspaceId: number
): Promise<ProjectsResponse> => {
  try {
    const response = await apiClient.get<PaginatedResponse<ProjectsResponse>>(
      API_ROUTES.projects.projects(workspaceId)
    );
    return response.data.data.content;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch projects'
    );
  }
};

export const getProjectById = async (
  workspaceId: number,
  id: number
): Promise<Project> => {
  try {
    const response = await apiClient.get<ApiResponse<Project>>(
      `${API_ROUTES.projects.projects(workspaceId)}/${id}`
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to fetch project'
    );
  }
};

export const createProject = async (
  workspaceId: number,
  project: ProjectCreate
): Promise<Project> => {
  try {
    const response = await apiClient.post<ApiResponse<Project>>(
      API_ROUTES.projects.projects(workspaceId),
      project
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to create project'
    );
  }
};

export const updateProject = async (
  workspaceId: number,
  project: ProjectEdit
): Promise<Project> => {
  try {
    const response = await apiClient.put<ApiResponse<Project>>(
      `${API_ROUTES.projects.projects(workspaceId)}/${project.id}`,
      project
    );
    return response.data.data;
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to update project'
    );
  }
};

export const deleteProject = async (
  workspaceId: number,
  id: number
): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<Project>>(
      `${API_ROUTES.projects.projects(workspaceId)}/${id}`
    );
  } catch (error) {
    const axiosError = error as ApiError;
    throw new Error(
      axiosError.response?.data?.message || 'Failed to delete project'
    );
  }
};
