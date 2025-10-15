import {
  createIssue,
  deleteIssue,
  getIssueById,
  getIssues,
  updateIssue,
} from '@/api/issues';
import { IssueStatus } from '@/constants/issue';
import { Issue, IssueCreate, IssueEdit, IssuesResponse } from '@/schemas/issue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const QUERY_KEYS = {
  issues: (workspaceId: number) => ['issues', workspaceId],
  issuesList: (workspaceId: number) => [
    ...QUERY_KEYS.issues(workspaceId),
    'list',
  ],
  issue: (workspaceId: number, id: number) => ['issue', workspaceId, id],
} as const;

export const DEFAULT_ISSUES_RESPONSE: IssuesResponse = {
  BACKLOG: [],
  TO_DO: [],
  IN_PROGRESS: [],
  DONE: [],
  CANCELED: [],
  DUPLICATE: [],
} as const;

export const useIssues = (workspaceId: number) => {
  const queryClient = useQueryClient();

  const issuesQuery = useQuery<IssuesResponse, AxiosError>({
    queryKey: QUERY_KEYS.issuesList(workspaceId),
    queryFn: () => getIssues(workspaceId),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createIssueMutation = useMutation({
    mutationFn: (issue: IssueCreate) => createIssue(workspaceId, issue),
    onSuccess: newIssue => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });

      queryClient.setQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId),
        old => {
          const status: IssueStatus = newIssue.status || 'BACKLOG';
          if (!old) {
            return { [status]: [newIssue] } as IssuesResponse;
          }
          return {
            ...old,
            [status]: [...(old[status] || []), newIssue],
          };
        }
      );
    },
  });

  const updateIssueMutation = useMutation({
    mutationFn: (issue: IssueEdit) => updateIssue(workspaceId, issue),
    onMutate: async updatedIssue => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.issue(workspaceId, updatedIssue.id!),
      });

      const previousIssues = queryClient.getQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId)
      );
      const previousIssue = queryClient.getQueryData<Issue>(
        QUERY_KEYS.issue(workspaceId, updatedIssue.id!)
      );

      if (previousIssues && previousIssue) {
        const oldStatus: IssueStatus = previousIssue.status || 'BACKLOG';
        const newStatus: IssueStatus = updatedIssue.status || oldStatus;

        queryClient.setQueryData<IssuesResponse>(
          QUERY_KEYS.issuesList(workspaceId),
          old => {
            if (!old) return old;
            const updatedIssues = { ...old };

            updatedIssues[oldStatus] = (updatedIssues[oldStatus] || []).filter(
              w => w.id !== updatedIssue.id
            );

            updatedIssues[newStatus] = [
              ...(updatedIssues[newStatus] || []),
              { ...previousIssue, ...updatedIssue },
            ];

            return updatedIssues;
          }
        );
      }

      queryClient.setQueryData<Issue>(
        QUERY_KEYS.issue(workspaceId, updatedIssue.id!),
        oldIssue => (oldIssue ? { ...oldIssue, ...updatedIssue } : updatedIssue)
      );

      return { previousIssues, previousIssue };
    },
    onError: (_err, variables, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(
          QUERY_KEYS.issuesList(workspaceId),
          context.previousIssues
        );
      }
      if (context?.previousIssue) {
        queryClient.setQueryData(
          QUERY_KEYS.issue(workspaceId, variables.id!),
          context.previousIssue
        );
      }
    },
    onSettled: updatedIssue => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });
      if (updatedIssue) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.issue(workspaceId, updatedIssue.id!),
        });
      }
    },
  });

  const deleteIssueMutation = useMutation({
    mutationFn: (id: number) => deleteIssue(workspaceId, id),
    onMutate: async id => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });

      const previousIssues = queryClient.getQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId)
      );

      if (previousIssues) {
        queryClient.setQueryData<IssuesResponse>(
          QUERY_KEYS.issuesList(workspaceId),
          old => {
            if (!old) return old;
            const updatedIssues = { ...old };

            const status = Object.keys(updatedIssues).find(key =>
              updatedIssues[key as IssueStatus].some(w => w.id === id)
            ) as IssueStatus;

            if (status) {
              updatedIssues[status] = updatedIssues[status].filter(
                w => w.id !== id
              );
            }

            return updatedIssues;
          }
        );
      }

      return { previousIssues };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(
          QUERY_KEYS.issuesList(workspaceId),
          context.previousIssues
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });
    },
  });

  return {
    data: issuesQuery.data || DEFAULT_ISSUES_RESPONSE,
    isLoading: issuesQuery.isLoading,
    isError: issuesQuery.isError,
    error: issuesQuery.error,
    createIssue: createIssueMutation.mutateAsync,
    updateIssue: updateIssueMutation.mutateAsync,
    deleteIssue: deleteIssueMutation.mutateAsync,
  };
};

export const useIssueById = (workspaceId?: number, id?: number) => {
  const issueByIdQuery = useQuery<Issue, AxiosError>({
    queryKey: QUERY_KEYS.issue(workspaceId!, id!),
    queryFn: () => getIssueById(workspaceId!, id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    issue: issueByIdQuery.data,
    isLoading: issueByIdQuery.isLoading,
    error: issueByIdQuery.error,
  };
};
