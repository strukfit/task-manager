import { getPriorityIcon, getProjectIcon, getStatusIcon } from './issue-icons';
import {
  ISSUE_STATUS_LABELS,
  ISSUE_STATUSES,
  IssueStatus,
} from './issue-status';
import {
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  IssuePriority,
} from './issue-priority';
import { IssueGroupBy } from './issue-filter';
import { IssueEdit } from '@/schemas/issue';
import { Project } from '@/schemas/project';

export interface GroupItem {
  id: string;
  name: string;
  key: string;
  icon: React.ReactNode | null;
}

export interface GroupingStrategy {
  getItems(): GroupItem[];
  getItems<T extends object[]>(deps?: T): GroupItem[];
  getFieldUpdate: (itemId: string) => Partial<IssueEdit>;
  getExtraItems?: () => GroupItem[];
}

export const GROUPING_CONFIG: Record<IssueGroupBy, GroupingStrategy> = {
  status: {
    getItems: () =>
      ISSUE_STATUSES.map(status => ({
        id: status,
        key: status,
        name: ISSUE_STATUS_LABELS[status],
        icon: getStatusIcon(status),
      })),
    getFieldUpdate: (id: string) => ({ status: id as IssueStatus }),
  },

  priority: {
    getItems: () =>
      ISSUE_PRIORITIES.map(priority => ({
        id: priority,
        key: priority,
        name: ISSUE_PRIORITY_LABELS[priority],
        icon: getPriorityIcon(priority),
      })),
    getFieldUpdate: (id: string) => ({ priority: id as IssuePriority }),
  },

  project: {
    getItems: (projects: Project[] = []) =>
      projects.map(p => ({
        id: p.id.toString(),
        key: p.name,
        name: p.name,
        icon: getProjectIcon(p.id.toString()),
      })),
    getExtraItems: () => [
      {
        id: '-1',
        key: '-1',
        name: 'No project',
        icon: getProjectIcon('-1'),
      },
    ],
    getFieldUpdate: (id: string) => ({ projectId: Number(id) }),
  },

  none: {
    getItems: () => [
      {
        id: 'all',
        key: 'all',
        name: 'All Issues',
        icon: null,
      },
    ],
    getFieldUpdate: () => ({}),
  },
} as const;
