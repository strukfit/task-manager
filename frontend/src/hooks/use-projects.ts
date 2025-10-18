import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from '@/api/projects';
import {
  Project,
  ProjectCreate,
  ProjectEdit,
  ProjectsResponse,
} from '@/schemas/project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { QUERY_KEYS as ISSUE_QUERY_KEYS } from './use-issues';

export const QUERY_KEYS = {
  projects: (workspaceId: number) => ['projects', workspaceId],
  projectsList: (workspaceId: number) => [
    ...QUERY_KEYS.projects(workspaceId),
    'list',
  ],
  project: (workspaceId: number, id: number) => ['project', workspaceId, id],
} as const;

export const useProjects = (workspaceId: number) => {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery<ProjectsResponse, AxiosError>({
    queryKey: QUERY_KEYS.projectsList(workspaceId),
    queryFn: () => getProjects(workspaceId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createProjectMutation = useMutation({
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

  const updateProjectMutation = useMutation({
    mutationFn: (project: ProjectEdit) => updateProject(workspaceId, project),
    onMutate: async updatedProject => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.project(workspaceId, updatedProject.id!),
      });

      const previousProjects = queryClient.getQueryData<ProjectsResponse>(
        QUERY_KEYS.projectsList(workspaceId)
      );
      const previousProject = queryClient.getQueryData<Project>(
        QUERY_KEYS.project(workspaceId, updatedProject.id!)
      );

      if (previousProjects) {
        queryClient.setQueryData<ProjectsResponse>(
          QUERY_KEYS.projectsList(workspaceId),
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
          QUERY_KEYS.projectsList(workspaceId),
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

  const deleteProjectMutation = useMutation({
    mutationFn: (id: number) => deleteProject(workspaceId, id),
    onMutate: async workspaceId => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.projects(workspaceId),
      });

      const previousProjects = queryClient.getQueryData<ProjectsResponse>(
        QUERY_KEYS.projectsList(workspaceId)
      );

      if (previousProjects) {
        queryClient.setQueryData<ProjectsResponse>(
          QUERY_KEYS.projectsList(workspaceId),
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
          QUERY_KEYS.projectsList(workspaceId),
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

  return {
    data: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
};

export const useProjectById = (workspaceId?: number, id?: number) => {
  const projectByIdQuery = useQuery<Project, AxiosError>({
    queryKey: QUERY_KEYS.project(workspaceId!, id!),
    queryFn: () => getProjectById(workspaceId!, id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    project: projectByIdQuery.data,
    isLoading: projectByIdQuery.isLoading,
    error: projectByIdQuery.error,
  };
};
