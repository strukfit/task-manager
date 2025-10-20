import type { AxiosError } from 'axios';

export type ApiError = AxiosError<{ message?: string }>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface BaseParamsConfig {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
