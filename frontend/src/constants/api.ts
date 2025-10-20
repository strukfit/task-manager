const rawBase = import.meta.env.BASE_URL ?? '/';
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

export const BASE_URL = `${normalizedBase}/api/v1`;

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
    requestPasswordReset: '/auth/password/reset/request',
    resetPassword: '/auth/password/reset/complete',
  },
  workspaces: {
    workspaces: '/workspaces',
  },
  issues: {
    issues: (workspaceId: number) => `workspaces/${workspaceId}/issues`,
  },
  projects: {
    projects: (workspaceId: number) => `workspaces/${workspaceId}/projects`,
  },
} as const;
