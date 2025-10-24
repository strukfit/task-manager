import {
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_GROUP_BY,
  ISSUE_GROUP_BY_LABELS,
  ISSUE_SORT_BY,
  ISSUE_SORT_BY_LABELS,
  IssueGroupBy,
  IssueStatus,
  IssuePriority,
  getStatusIcon,
  getPriorityIcon,
  getProjectIcon,
} from '@/constants/issue';
import { useProjects } from '@/hooks/use-projects';
import { IssuesQueryConfig } from '@/hooks/use-issues';
import { Button } from '../ui/button';
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowUpDown,
  SquareKanban,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '../ui/multi-select';
import { useMemo } from 'react';

interface FilterControlsProps {
  config: IssuesQueryConfig;
  setConfig: (config: IssuesQueryConfig) => void;
  workspaceId: number;
}

export default function FilterControls({
  config,
  setConfig,
  workspaceId,
}: FilterControlsProps) {
  const { data: projects, isLoading } = useProjects(workspaceId);

  const filterOptions = useMemo(
    () => [
      {
        heading: 'Issue Statuses',
        options: ISSUE_STATUSES.map(status => ({
          value: status,
          icon: getStatusIcon(status),
          label: ISSUE_STATUS_LABELS[status],
        })),
      },
      {
        heading: 'Issue Priorities',
        options: ISSUE_PRIORITIES.map(priority => ({
          value: priority,
          icon: getPriorityIcon(priority),
          label: ISSUE_PRIORITY_LABELS[priority],
        })),
      },
      {
        heading: 'Projects',
        options: [
          { value: '-1', icon: getProjectIcon('-1'), label: 'No Project' },
          ...projects.map(project => {
            const projectId = project.id.toString();
            return {
              value: projectId,
              icon: getProjectIcon(projectId),
              label: project.name,
            };
          }),
        ],
      },
    ],
    [projects]
  );

  const groupByOptions = ISSUE_GROUP_BY.map(value => ({
    value,
    label: ISSUE_GROUP_BY_LABELS[value],
  }));

  const sortByOptions = ISSUE_SORT_BY.map(value => ({
    value,
    label: ISSUE_SORT_BY_LABELS[value],
  }));

  const handleFilterChange = (selected: string[]) => {
    const statuses = selected.filter(s =>
      ISSUE_STATUSES.includes(s as IssueStatus)
    ) as IssueStatus[];
    const priorities = selected.filter(s =>
      ISSUE_PRIORITIES.includes(s as IssuePriority)
    ) as IssuePriority[];
    const projectIds = selected
      .filter(s => s === '-1' || projects.some(p => p.id.toString() === s))
      .map(Number);
    setConfig({
      ...config,
      statuses: statuses.length > 0 ? statuses : undefined,
      priorities: priorities.length > 0 ? priorities : undefined,
      projectIds: projectIds.length > 0 ? projectIds : undefined,
    });
  };

  const handleGroupByChange = (value: string) => {
    setConfig({ ...config, groupBy: value as IssueGroupBy });
  };

  const handleSortByChange = (value: string) => {
    setConfig({
      ...config,
      sortBy: value,
    });
  };

  const handleSortOrderToggle = () => {
    const newSortOrder = config.sortOrder === 'asc' ? 'desc' : 'asc';
    setConfig({ ...config, sortOrder: newSortOrder });
  };

  return (
    <div className="flex flex-row mb-2 gap-1">
      <MultiSelect onValuesChange={handleFilterChange}>
        <MultiSelectTrigger
          disabled={isLoading}
          className="w-full max-w-[400px]"
        >
          <MultiSelectValue placeholder="Filter By..." />
        </MultiSelectTrigger>
        <MultiSelectContent>
          {filterOptions.map(group => (
            <MultiSelectGroup key={group.heading} heading={group.heading}>
              {group.options.map(({ value, label, icon }) => (
                <MultiSelectItem key={value} value={value}>
                  {icon}
                  {label}
                </MultiSelectItem>
              ))}
            </MultiSelectGroup>
          ))}
        </MultiSelectContent>
      </MultiSelect>

      <Select
        value={config.groupBy || 'status'}
        onValueChange={handleGroupByChange}
      >
        <SelectTrigger className="[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300 select-none rounded-sm">
          <SelectValue>
            <SquareKanban className="h-5 w-5 text-primary" />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {groupByOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={config.sortBy || 'createdAt'}
        onValueChange={handleSortByChange}
      >
        <SelectTrigger className="[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300 select-none rounded-sm">
          <SelectValue>
            <ArrowUpDown className="h-5 w-5 text-primary" />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortByOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSortOrderToggle} variant="outline">
        {config.sortOrder === 'asc' ? (
          <ArrowDownNarrowWide className="h-5 w-5" />
        ) : (
          <ArrowDownWideNarrow className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
