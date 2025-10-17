export const ISSUE_STATUS_LABELS = {
  BACKLOG: 'Backlog',
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELED: 'Canceled',
  DUPLICATE: 'Duplicate',
} as const;

export const ISSUE_STATUSES = [
  'BACKLOG',
  'TO_DO',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
  'DUPLICATE',
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_STATUS_COLUMNS = {
  BACKLOG: { id: 'BACKLOG', name: 'Backlog' },
  TO_DO: { id: 'TO_DO', name: 'To Do' },
  IN_PROGRESS: { id: 'IN_PROGRESS', name: 'In Progress' },
  DONE: { id: 'DONE', name: 'Done' },
  CANCELED: { id: 'CANCELED', name: 'Canceled' },
  DUPLICATE: { id: 'DUPLICATE', name: 'Duplicate' },
} as const;
