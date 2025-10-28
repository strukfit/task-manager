import {
  createIssue,
  deleteIssue,
  getIssueById,
  getIssues,
  GetIssuesParams,
  updateIssue,
} from '@/api/issues';
import { Issue, IssueCreate, IssueEdit, IssuesResponse } from '@/schemas/issue';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type IssuesQueryConfig = GetIssuesParams;

export const QUERY_KEYS = {
  issues: (workspaceId: number) => ['issues', workspaceId],
  issuesList: (workspaceId: number, config: IssuesQueryConfig) => [
    ...QUERY_KEYS.issues(workspaceId),
    'list',
    config,
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

const getGroupKey = (issue: Issue, config: IssuesQueryConfig) =>
  config.groupBy === 'status'
    ? issue.status
    : config.groupBy === 'priority'
      ? issue.priority
      : config.groupBy === 'project'
        ? issue.project?.id?.toString() || '-1'
        : 'all';

const useCreateIssueMutation = (
  queryClient: QueryClient,
  workspaceId: number,
  config: IssuesQueryConfig = {}
) =>
  useMutation({
    mutationFn: (issue: IssueCreate) => createIssue(workspaceId, issue),
    onSuccess: newIssue => {
      queryClient.setQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId, config),
        (old = DEFAULT_ISSUES_RESPONSE) => {
          const groupKey = getGroupKey(newIssue, config);
          const newIssues = { ...old };
          newIssues[groupKey] = [...(newIssues[groupKey] || []), newIssue];
          return newIssues;
        }
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issue(workspaceId, newIssue.id),
      });
    },
  });

const useUpdateIssueMutation = (
  queryClient: QueryClient,
  workspaceId: number,
  config: IssuesQueryConfig = {}
) =>
  useMutation({
    mutationFn: (issue: IssueEdit) => updateIssue(workspaceId, issue),
    onSuccess: updatedIssue => {
      queryClient.setQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId, config),
        (old = {}) => {
          const oldIssues = { ...old };
          const oldGroupKey = Object.keys(old).find(key =>
            old[key].some(i => i.id === updatedIssue.id)
          );
          if (!oldGroupKey) return old;

          oldIssues[oldGroupKey] = old[oldGroupKey].filter(
            i => i.id !== updatedIssue.id
          );

          const newGroupKey = getGroupKey(updatedIssue, config);

          oldIssues[newGroupKey] = [
            ...(oldIssues[newGroupKey] || []),
            updatedIssue,
          ];

          if (oldIssues[oldGroupKey].length === 0)
            delete oldIssues[oldGroupKey];

          return oldIssues;
        }
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issue(workspaceId, updatedIssue.id),
      });
    },
  });

const useDeleteIssueMutation = (
  queryClient: QueryClient,
  workspaceId: number,
  config: IssuesQueryConfig = {}
) =>
  useMutation({
    mutationFn: (id: number) => deleteIssue(workspaceId, id),
    onMutate: async issueId => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.issuesList(workspaceId, config),
      });

      const previousIssues = queryClient.getQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId, config)
      );

      queryClient.setQueryData<IssuesResponse>(
        QUERY_KEYS.issuesList(workspaceId, config),
        (old = {}) => {
          const newIssues = { ...old };
          const groupKey = Object.keys(old).find(key =>
            old[key].some(i => i.id === issueId)
          );
          if (!groupKey) return old;

          newIssues[groupKey] = old[groupKey].filter(i => i.id !== issueId);
          if (newIssues[groupKey].length === 0) delete newIssues[groupKey];

          return newIssues;
        }
      );

      return { previousIssues };
    },
    onError: (_error, _issueId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.issuesList(workspaceId, config),
        context?.previousIssues
      );
    },
    onSuccess: (_data, issueId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issues(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.issue(workspaceId, issueId),
      });
    },
  });

export const useIssues = (
  workspaceId: number,
  config: IssuesQueryConfig = {}
) => {
  const queryClient = useQueryClient();

  const { enabled = true } = config;

  const issuesQuery = useQuery<IssuesResponse, AxiosError>({
    queryKey: QUERY_KEYS.issuesList(workspaceId, config),
    queryFn: () => getIssues(workspaceId, config),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createIssueMutation = useCreateIssueMutation(
    queryClient,
    workspaceId,
    config
  );

  const updateIssueMutation = useUpdateIssueMutation(
    queryClient,
    workspaceId,
    config
  );

  const deleteIssueMutation = useDeleteIssueMutation(
    queryClient,
    workspaceId,
    config
  );

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
  const queryClient = useQueryClient();

  const issueByIdQuery = useQuery<Issue, AxiosError>({
    queryKey: QUERY_KEYS.issue(workspaceId!, id!),
    queryFn: () => getIssueById(workspaceId!, id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const createIssueMutation = useCreateIssueMutation(queryClient, workspaceId!);

  const updateIssueMutation = useUpdateIssueMutation(queryClient, workspaceId!);

  const deleteIssueMutation = useDeleteIssueMutation(queryClient, workspaceId!);

  return {
    issue: issueByIdQuery.data,
    isLoading: issueByIdQuery.isLoading,
    error: issueByIdQuery.error,
    createIssue: createIssueMutation.mutateAsync,
    updateIssue: updateIssueMutation.mutateAsync,
    deleteIssue: deleteIssueMutation.mutateAsync,
  };
};
