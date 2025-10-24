import type { AxiosError } from 'axios';

export type ApiError = AxiosError<{ message?: string }>;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface Pagination<T> {
  content: T;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  empty: boolean;
}

export type PaginatedResponse<T> = ApiResponse<Pagination<T>>;

interface SortParamsConfig {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type SortParams = keyof SortParamsConfig;

export type BaseParamsConfig = SortParamsConfig;
