const rawBase = import.meta.env.BASE_URL ?? '/';
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

export const BASE_URL = `${normalizedBase}/api/v1`;

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
  },
  tasks: '/tasks',
} as const;
