import {
  getPriorityIcon,
  getProjectIcon,
  getStatusIcon,
  ISSUE_PRIORITIES,
  ISSUE_PRIORITY_LABELS,
  ISSUE_STATUS_LABELS,
  ISSUE_STATUSES,
  IssuePriority,
  IssueStatus,
} from '@/constants/issue';
import { IssuesQueryConfig, useIssues } from '@/hooks/use-issues';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  rectIntersection,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { toast } from 'sonner';
import { Columns } from '@/types/board';
import DroppableColumn from '@/components/board/droppable-column';
import { CreateIssueDialog } from './create-issue-dialog';
import { useProjects } from '@/hooks/use-projects';
import { IssueCreate, IssueEdit } from '@/schemas/issue';
import FilterControls from '../board/filter-controls';
import { Loader2 } from 'lucide-react';

export default function IssuesBoard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitValues, setDialogInitValues] =
    useState<Partial<IssueCreate> | null>(null);
  const { workspaceId: workspaceIdParam, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  const [config, setConfig] = useState<IssuesQueryConfig>({
    groupBy: 'status',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    projectIds: projectId ? [Number(projectId)] : undefined,
  });

  const [columns, setColumns] = useState<Columns>({});

  const [activeNode, setActiveNode] = useState<React.ReactNode | null>(null);

  const workspaceId = Number(workspaceIdParam);
  const {
    data: issues,
    updateIssue,
    isLoading: issuesLoading,
  } = useIssues(workspaceId, config);
  const { data: projects, isLoading: projectsLoading } =
    useProjects(workspaceId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const newColumns: Columns = {};
    if (config.groupBy === 'status') {
      ISSUE_STATUSES.forEach(status => {
        newColumns[status] = {
          id: status,
          name: ISSUE_STATUS_LABELS[status],
          icon: getStatusIcon(status),
          issues: issues[status] || [],
        };
      });
    } else if (config.groupBy === 'priority') {
      ISSUE_PRIORITIES.forEach(priority => {
        newColumns[priority] = {
          id: priority,
          name: ISSUE_PRIORITY_LABELS[priority],
          icon: getPriorityIcon(priority),
          issues: issues[priority] || [],
        };
      });
    } else if (config.groupBy === 'project') {
      projects.forEach(project => {
        const projectId = project.id.toString();
        const projectName = project.name;
        newColumns[projectId] = {
          id: projectId,
          name: projectName,
          icon: getProjectIcon(projectId),
          issues: issues[projectName] || [],
        };
      });
      newColumns['-1'] = {
        id: '-1',
        name: 'No project',
        icon: getProjectIcon('-1'),
        issues: issues['-1'] || [],
      };
    } else if (config.groupBy === 'none') {
      newColumns['all'] = {
        id: 'all',
        name: 'All Issues',
        issues: issues['all'] || [],
      };
    }
    setColumns(newColumns);
  }, [issues, config.groupBy, projects]);

  const onDragStart = useCallback((event: DragStartEvent) => {
    const element = event.active.data.current?.element;
    setActiveNode(element || null);
  }, []);

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveNode(null);
      const { active, over } = event;

      const activeId = active.id.toString();
      const activeContainer = active.data.current?.sortable.containerId;

      let overContainer: string | number;
      if (over) {
        overContainer = over.data.current?.sortable.containerId || over.id;
      } else {
        const collisions = event.collisions;
        if (!collisions || collisions.length <= 0) return;
        overContainer = collisions[0].id;
      }

      if (activeContainer === overContainer) return;

      const activeIssue = columns[activeContainer].issues.find(
        i => i.id.toString() === activeId
      );
      if (!activeIssue) return;

      let overIndex = columns[overContainer].issues.length;
      if (over && over.id.toString() !== activeId) {
        overIndex = columns[overContainer].issues.findIndex(
          issue => issue.id.toString() === over.id.toString()
        );
      }

      const sourceIssues = [...columns[activeContainer].issues];
      const destIssues = [...columns[overContainer].issues];
      const sourceIndex = sourceIssues.findIndex(
        i => i.id.toString() === activeId
      );
      sourceIssues.splice(sourceIndex, 1);
      const updatedIssue: IssueEdit = { ...activeIssue };
      if (config.groupBy === 'status') {
        updatedIssue.status = overContainer as IssueStatus;
      } else if (config.groupBy === 'priority') {
        updatedIssue.priority = overContainer as IssuePriority;
      } else if (config.groupBy === 'project') {
        updatedIssue.projectId = overContainer as number;
      }
      destIssues.splice(overIndex, 0, updatedIssue);

      setColumns({
        ...columns,
        [activeContainer]: {
          ...columns[activeContainer],
          issues: sourceIssues,
        },
        [overContainer]: { ...columns[overContainer], issues: destIssues },
      });

      try {
        await updateIssue(updatedIssue);
      } catch (err) {
        const error = err as Error;
        toast(error.message || 'Failed to update issue');
        setColumns(columns);
      }
    },
    [columns, config.groupBy, updateIssue]
  );

  const openDialog = (initValue: string) => {
    const initValues: Partial<IssueCreate> = {};
    if (config.groupBy === 'status') {
      initValues.status = initValue as IssueStatus;
    } else if (config.groupBy === 'priority') {
      initValues.priority = initValue as IssuePriority;
    } else if (config.groupBy === 'project') {
      initValues.projectId = Number(initValue);
    }
    setDialogInitValues(initValues);
    setDialogOpen(true);
  };

  return (
    <>
      <div>
        <FilterControls
          config={config}
          setConfig={setConfig}
          workspaceId={workspaceId}
        />
      </div>
      {issuesLoading || projectsLoading ? (
        <div className="flex flex-row justify-center w-screen">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col">
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:flex lg:flex-row gap-2 w-full">
              {Object.entries(columns).map(([columnId, column]) => (
                <DroppableColumn
                  key={columnId}
                  columnId={columnId}
                  column={column}
                  onOpenCreateDialog={openDialog}
                />
              ))}
              <CreateIssueDialog
                initValues={dialogInitValues || {}}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
              />
            </div>
            <DragOverlay zIndex={1000}>{activeNode}</DragOverlay>
          </DndContext>
        </div>
      )}
    </>
  );
}
