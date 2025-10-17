export const ISSUE_PRIORITY_LABELS = {
  NONE: 'No Priority',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

export const ISSUE_PRIORITIES = [
  'NONE',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const;

export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];
