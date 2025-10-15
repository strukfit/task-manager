const rawBase = import.meta.env.BASE_URL ?? '/';
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

export const BASE_URL = `${normalizedBase}/api/v1`;

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
  },
  workspaces: {
    workspaces: '/workspaces',
  },
  issues: {
    issues: (workspaceId: number) => `workspaces/${workspaceId}/issues`,
  },
} as const;
