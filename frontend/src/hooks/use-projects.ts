import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  GetProjectsParams,
  updateProject,
} from '@/api/projects';
import {
  Project,
  ProjectCreate,
  ProjectEdit,
  ProjectsResponse,
} from '@/schemas/project';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { QUERY_KEYS as ISSUE_QUERY_KEYS } from './use-issues';
import { Pagination } from '@/types/common';

export type ProjectsQueryConfig = GetProjectsParams;

export const QUERY_KEYS = {
  projects: (workspaceId: number) => ['projects', workspaceId],
  projectsList: (workspaceId: number, config: ProjectsQueryConfig) => [
    ...QUERY_KEYS.projects(workspaceId),
    'list',
    config,
  ],
  project: (workspaceId: number, id: number) => ['project', workspaceId, id],
} as const;

const useCreateProjectMutation = (
  queryClient: QueryClient,
  workspaceId: number
) =>
  useMutation({
    mutationFn: (project: ProjectCreate) => createProject(workspaceId, project),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });
      await queryClient.invalidateQueries({
        queryKey: ISSUE_QUERY_KEYS.issues(workspaceId),
      });
    },
  });

const useDeleteProjectMutation = (
  queryClient: QueryClient,
  workspaceId: number,
  config: ProjectsQueryConfig = {}
) =>
  useMutation({
    mutationFn: (id: number) => deleteProject(workspaceId, id),
    onMutate: async workspaceId => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });

      const previousProjects = queryClient.getQueryData<ProjectsResponse>(
        QUERY_KEYS.projectsList(workspaceId, config)
      );

      if (previousProjects) {
        queryClient.setQueryData<ProjectsResponse>(
          QUERY_KEYS.projectsList(workspaceId, config),
          {
            ...previousProjects.filter(w => w.id !== workspaceId),
          }
        );
      }

      return { previousProjects };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(
          QUERY_KEYS.projectsList(workspaceId, config),
          context.previousProjects
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });
      await queryClient.invalidateQueries({
        queryKey: ISSUE_QUERY_KEYS.issues(workspaceId),
      });
    },
  });

const useUpdateProjectMutation = (
  queryClient: QueryClient,
  workspaceId: number,
  config: ProjectsQueryConfig = {}
) =>
  useMutation({
    mutationFn: (project: ProjectEdit) => updateProject(workspaceId, project),
    onMutate: async updatedProject => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.project(workspaceId, updatedProject.id!),
      });

      const previousProjects = queryClient.getQueryData<ProjectsResponse>(
        QUERY_KEYS.projectsList(workspaceId, config)
      );
      const previousProject = queryClient.getQueryData<Project>(
        QUERY_KEYS.project(workspaceId, updatedProject.id!)
      );

      if (previousProjects) {
        queryClient.setQueryData<ProjectsResponse>(
          QUERY_KEYS.projectsList(workspaceId, config),
          {
            ...previousProjects.map(w =>
              w.id === updatedProject.id ? { ...w, ...updatedProject } : w
            ),
          }
        );
      }

      queryClient.setQueryData<Project>(
        QUERY_KEYS.project(workspaceId, updatedProject.id!),
        oldProject =>
          oldProject ? { ...oldProject, ...updatedProject } : updatedProject
      );

      return { previousProjects, previousProject };
    },
    onError: (_err, variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(
          QUERY_KEYS.projectsList(workspaceId, config),
          context.previousProjects
        );
      }
      if (context?.previousProject) {
        queryClient.setQueryData(
          QUERY_KEYS.project(workspaceId, variables.id!),
          context.previousProject
        );
      }
    },
    onSettled: async updatedProject => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });
      if (updatedProject) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.project(workspaceId, updatedProject.id!),
        });
        await queryClient.invalidateQueries({
          queryKey: ISSUE_QUERY_KEYS.issues(workspaceId),
        });
      }
    },
  });

export const useProjects = (
  workspaceId: number,
  config: ProjectsQueryConfig = {}
) => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery<Pagination<ProjectsResponse>, AxiosError>({
    queryKey: QUERY_KEYS.projectsList(workspaceId, config),
    queryFn: () => getProjects(workspaceId, config),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createProjectMutation = useCreateProjectMutation(
    queryClient,
    workspaceId
  );

  const updateProjectMutation = useUpdateProjectMutation(
    queryClient,
    workspaceId,
    config
  );

  const deleteProjectMutation = useDeleteProjectMutation(
    queryClient,
    workspaceId,
    config
  );

  return {
    data: projectsQuery.data?.content || [],
    pagination: {
      page: projectsQuery.data?.number ?? 1,
      limit: projectsQuery.data?.size ?? 1,
      pages: projectsQuery.data?.totalPages ?? 0,
      total: projectsQuery.data?.totalElements ?? 0,
    },
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
};

export const useProjectById = (workspaceId?: number, id?: number) => {
  const queryClient = useQueryClient();

  const projectByIdQuery = useQuery<Project, AxiosError>({
    queryKey: QUERY_KEYS.project(workspaceId!, id!),
    queryFn: () => getProjectById(workspaceId!, id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createProjectMutation = useCreateProjectMutation(
    queryClient,
    workspaceId!
  );

  const updateProjectMutation = useUpdateProjectMutation(
    queryClient,
    workspaceId!
  );

  const deleteProjectMutation = useDeleteProjectMutation(
    queryClient,
    workspaceId!
  );

  return {
    project: projectByIdQuery.data,
    isLoading: projectByIdQuery.isLoading,
    error: projectByIdQuery.error,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
};
