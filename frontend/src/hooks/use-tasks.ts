import { getTasks } from '@/api/tasks';
import { TaskResponse } from '@/schemas/task';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const QUERY_KEYS = {
  tasks: ['tasks'],
  tasksList: () => [...QUERY_KEYS.tasks, 'list'],
} as const;

export const useTasks = () => {
  const tasksQuery = useQuery<TaskResponse, AxiosError>({
    queryKey: QUERY_KEYS.tasksList(),
    queryFn: () => getTasks(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    data: tasksQuery.data?.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
  };
};
