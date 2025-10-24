import type { AxiosError } from 'axios';

export type ApiError = AxiosError<{ message?: string }>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface SortParamsConfig {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type SortParams = keyof SortParamsConfig;

export type BaseParamsConfig = SortParamsConfig;
