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
  getGroupByIcon,
  getSortByIcon,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '../ui/tooltip';

interface FilterControlsProps {
  config: IssuesQueryConfig;
  setConfig: (config: IssuesQueryConfig) => void;
  workspaceId: number;
  projectId?: number;
}

type Options = {
  heading: string;
  options: {
    value: string;
    icon: React.ReactNode;
    label: string;
  }[];
}[];

export default function FilterControls({
  config,
  setConfig,
  workspaceId,
  projectId,
}: FilterControlsProps) {
  const { data: projects, isLoading } = useProjects(workspaceId, {
    enabled: !projectId,
  });

  const filterOptions = useMemo(() => {
    const options: Options = [
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
    ];
    if (!projectId && projects) {
      options.push({
        heading: 'Projects',
        options: [
          {
            value: String(-1),
            icon: getProjectIcon(String(-1)),
            label: 'No Project',
          },
          ...projects.map(project => {
            const projectId = String(project.id);
            return {
              value: projectId,
              icon: getProjectIcon(projectId),
              label: project.name,
            };
          }),
        ],
      });
    }
    return options;
  }, [projects, projectId]);

  const filterSelectedValues = useMemo(() => {
    const values: string[] = [];
    values.push(...(config.statuses ?? []));
    values.push(...(config.priorities ?? []));
    if (!projectId) values.push(...(config.projectIds?.map(String) ?? []));
    return values;
  }, [projectId, config.statuses, config.priorities, config.projectIds]);

  const groupByOptions = useMemo(() => {
    const options = ISSUE_GROUP_BY.map(value => {
      if (projectId && value === 'project') return null;
      return {
        value,
        icon: getGroupByIcon(value),
        label: ISSUE_GROUP_BY_LABELS[value],
      };
    });

    return options;
  }, [projectId]);

  const sortByOptions = ISSUE_SORT_BY.map(value => ({
    value,
    icon: getSortByIcon(value),
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
      projectIds: projectId
        ? [projectId]
        : projectIds.length > 0
          ? projectIds
          : undefined,
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
    <TooltipProvider>
      <div className="flex flex-row mb-2 gap-1">
        <MultiSelect
          values={filterSelectedValues}
          onValuesChange={handleFilterChange}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <MultiSelectTrigger
                disabled={isLoading}
                className="w-full max-w-[400px]"
              >
                <MultiSelectValue placeholder="Filter By..." />
              </MultiSelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Filter by</p>
            </TooltipContent>
          </Tooltip>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="[&>svg]:hidden select-none rounded-sm hover:bg-gray-100">
                <SelectValue>
                  <SquareKanban className="h-5 w-5 text-primary" />
                </SelectValue>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                Group by:{' '}
                {groupByOptions.find(o => o?.value === config.groupBy)?.label}
              </p>
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            {groupByOptions.map(
              option =>
                option && (
                  <SelectItem key={option.value} value={option.value}>
                    {option.icon}
                    {option.label}
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>

        <Select
          value={config.sortBy || 'createdAt'}
          onValueChange={handleSortByChange}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="[&>svg]:hidden select-none rounded-sm hover:bg-gray-100">
                <SelectValue>
                  <ArrowUpDown className="h-5 w-5 text-primary" />
                </SelectValue>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                Sort by:{' '}
                {sortByOptions.find(o => o.value === config.sortBy)?.label}
              </p>
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            {sortByOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.icon}
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleSortOrderToggle} variant="outline">
              {config.sortOrder === 'asc' ? (
                <ArrowDownNarrowWide className="h-5 w-5" />
              ) : (
                <ArrowDownWideNarrow className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Sort order:{' '}
              {config.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
