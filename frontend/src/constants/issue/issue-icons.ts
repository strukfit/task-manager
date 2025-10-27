import {
  Box,
  Calendar,
  CaseSensitive,
  ChartPie,
  CircleDashed,
  LucideIcon,
  Minus,
  Rows3,
  Signal,
  SignalHigh,
  SignalMedium,
  SquareDashed,
} from 'lucide-react';
import {
  Circle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import React from 'react';
import { IssueStatus } from './issue-status';
import { IssuePriority } from './issue-priority';
import { IssueGroupBy, IssueSortBy } from './issue-filter';
import { createIcon } from '../common';

export const priorityIcons: Record<IssuePriority, LucideIcon> = {
  NONE: Minus,
  LOW: SignalMedium,
  MEDIUM: SignalHigh,
  HIGH: Signal,
  CRITICAL: AlertTriangle,
};

export const statusIcons: Record<IssueStatus, LucideIcon> = {
  BACKLOG: CircleDashed,
  TO_DO: Circle,
  IN_PROGRESS: Circle,
  DONE: CheckCircle,
  CANCELED: XCircle,
  DUPLICATE: Info,
};

export const groupByIcons: Record<IssueGroupBy, LucideIcon> = {
  status: ChartPie,
  priority: Signal,
  project: Box,
  none: Rows3,
};

export const sortByIcons: Record<IssueSortBy, LucideIcon> = {
  status: ChartPie,
  priority: Signal,
  title: CaseSensitive,
  createdAt: Calendar,
};

export const noneProjectIcon = SquareDashed;
export const projectIcon = Box;

const colorMap = {
  priority: {
    NONE: 'text-gray-400',
    LOW: 'text-green-400',
    MEDIUM: 'text-yellow-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-400',
  },
  status: {
    BACKLOG: 'text-gray-400',
    TO_DO: 'text-blue-400',
    IN_PROGRESS: 'text-yellow-400',
    DONE: 'text-green-400',
    CANCELED: 'text-red-400',
    DUPLICATE: 'text-purple-400',
  },
  project: 'text-gray-400',
};

export const getStatusIcon = (
  status: IssueStatus,
  size: number = 4
): React.ReactElement => {
  const icon = statusIcons[status];
  const color = colorMap.status[status];
  return createIcon(icon, size, color);
};

export const getPriorityIcon = (
  priority: IssuePriority,
  size: number = 4
): React.ReactElement => {
  const icon = priorityIcons[priority];
  const color = colorMap.priority[priority];
  return createIcon(icon, size, color);
};

export const getProjectIcon = (projectId: string, size: number = 4) => {
  let icon = projectIcon;
  if (projectId === '-1') {
    icon = noneProjectIcon;
  }
  return createIcon(icon, size, colorMap.project);
};

export const getGroupByIcon = (groupBy: IssueGroupBy) => {
  const icon = groupByIcons[groupBy];
  return createIcon(icon);
};

export const getSortByIcon = (sortBy: IssueSortBy) => {
  const icon = sortByIcons[sortBy];
  return createIcon(icon);
};
