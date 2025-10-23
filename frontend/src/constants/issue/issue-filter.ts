export const ISSUE_GROUP_BY = [
  'status',
  'priority',
  'project',
  'none',
] as const;

export type IssueGroupBy = (typeof ISSUE_GROUP_BY)[number];

export const ISSUE_GROUP_BY_LABELS: Record<IssueGroupBy, string> = {
  status: 'Status',
  priority: 'Priority',
  project: 'Project',
  none: 'None',
} as const;

export const ISSUE_SORT_BY = [
  'title',
  'status',
  'priority',
  'createdAt',
] as const;

export type IssueSortBy = (typeof ISSUE_SORT_BY)[number];

export const ISSUE_SORT_BY_LABELS: Record<IssueSortBy, string> = {
  title: 'Title',
  status: 'Status',
  priority: 'Priority',
  createdAt: 'Created At',
} as const;
