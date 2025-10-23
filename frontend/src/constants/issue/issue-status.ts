export const ISSUE_STATUSES = [
  'BACKLOG',
  'TO_DO',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
  'DUPLICATE',
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  BACKLOG: 'Backlog',
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  CANCELED: 'Canceled',
  DUPLICATE: 'Duplicate',
} as const;
