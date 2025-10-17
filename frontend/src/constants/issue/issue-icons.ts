import {
  Box,
  CircleDashed,
  LucideIcon,
  Minus,
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

export const priorityIcons: Record<string, LucideIcon> = {
  NONE: Minus,
  LOW: SignalMedium,
  MEDIUM: SignalHigh,
  HIGH: Signal,
  CRITICAL: AlertTriangle,
};

export const statusIcons: Record<string, LucideIcon> = {
  BACKLOG: CircleDashed,
  TO_DO: Circle,
  IN_PROGRESS: Circle,
  DONE: CheckCircle,
  CANCELED: XCircle,
  DUPLICATE: Info,
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

export const getStatusIcon = (status: IssueStatus): React.ReactElement => {
  const icon = statusIcons[status];
  const color = colorMap.status[status];

  return React.createElement(icon, {
    className: `h-4 w-4 ${color}`,
  });
};

export const getPriorityIcon = (
  priority: IssuePriority
): React.ReactElement => {
  const icon = priorityIcons[priority];
  const color = colorMap.priority[priority];

  return React.createElement(icon, {
    className: `h-4 w-4 ${color}`,
  });
};

export const getProjectIcon = (projectId: string) => {
  let icon = projectIcon;
  if (projectId === '-1') {
    icon = noneProjectIcon;
  }

  return React.createElement(icon, {
    className: `h-4 w-4 ${colorMap.project}`,
  });
};
