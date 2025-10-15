import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
} from '@/api/workspaces';
import { Workspace, WorkspacesResponse } from '@/schemas/workspace';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const QUERY_KEYS = {
  workspaces: ['workspaces'],
  workspacesList: () => [...QUERY_KEYS.workspaces, 'list'],
  workspace: (id: number) => ['workspace', id],
} as const;

export const useWorkspaces = () => {
  const queryClient = useQueryClient();

  const workspacesQuery = useQuery<WorkspacesResponse, AxiosError>({
    queryKey: QUERY_KEYS.workspacesList(),
    queryFn: () => getWorkspaces(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces });
    },
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: updateWorkspace,
    onMutate: async updatedWorkspace => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.workspaces });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.workspace(updatedWorkspace.id!),
      });

      const previousWorkspaces = queryClient.getQueryData<WorkspacesResponse>(
        QUERY_KEYS.workspacesList()
      );
      const previousWorkspace = queryClient.getQueryData<Workspace>(
        QUERY_KEYS.workspace(updatedWorkspace.id!)
      );

      if (previousWorkspaces) {
        queryClient.setQueryData<WorkspacesResponse>(
          QUERY_KEYS.workspacesList(),
          {
            ...previousWorkspaces.map(w =>
              w.id === updatedWorkspace.id ? { ...w, ...updatedWorkspace } : w
            ),
          }
        );
      }

      queryClient.setQueryData<Workspace>(
        QUERY_KEYS.workspace(updatedWorkspace.id!),
        oldWorkspace =>
          oldWorkspace
            ? { ...oldWorkspace, ...updatedWorkspace }
            : updatedWorkspace
      );

      return { previousWorkspaces, previousWorkspace };
    },
    onError: (_err, variables, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(
          QUERY_KEYS.workspacesList(),
          context.previousWorkspaces
        );
      }
      if (context?.previousWorkspace) {
        queryClient.setQueryData(
          QUERY_KEYS.workspace(variables.id!),
          context.previousWorkspace
        );
      }
    },
    onSettled: updatedWorkspace => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces });
      if (updatedWorkspace) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.workspace(updatedWorkspace.id!),
        });
      }
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: deleteWorkspace,
    onMutate: async workspaceId => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.workspaces });

      const previousWorkspaces = queryClient.getQueryData<WorkspacesResponse>(
        QUERY_KEYS.workspacesList()
      );

      if (previousWorkspaces) {
        queryClient.setQueryData<WorkspacesResponse>(
          QUERY_KEYS.workspacesList(),
          {
            ...previousWorkspaces.filter(w => w.id !== workspaceId),
          }
        );
      }

      return { previousWorkspaces };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWorkspaces) {
        queryClient.setQueryData(
          QUERY_KEYS.workspacesList(),
          context.previousWorkspaces
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspaces });
    },
  });

  return {
    data: workspacesQuery.data || [],
    isLoading: workspacesQuery.isLoading,
    isError: workspacesQuery.isError,
    error: workspacesQuery.error,
    createWorkspace: createWorkspaceMutation.mutateAsync,
    updateWorkspace: updateWorkspaceMutation.mutateAsync,
    deleteWorkspace: deleteWorkspaceMutation.mutateAsync,
  };
};

export const useWorkspaceById = (id?: number) => {
  const workspaceByIdQuery = useQuery<Workspace, AxiosError>({
    queryKey: QUERY_KEYS.workspace(id!),
    queryFn: () => getWorkspaceById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    workspace: workspaceByIdQuery.data,
    isLoading: workspaceByIdQuery.isLoading,
    error: workspaceByIdQuery.error,
  };
};
