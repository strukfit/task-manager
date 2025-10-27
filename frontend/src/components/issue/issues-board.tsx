import { IssuesQueryConfig, useIssues } from '@/hooks/use-issues';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

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
import { GROUPING_CONFIG } from '@/constants/issue/issue-grouping';
import { IssueGroupBy, IssuePriority, IssueStatus } from '@/constants/issue';

export default function IssuesBoard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitValues, setDialogInitValues] =
    useState<Partial<IssueCreate> | null>(null);
  const { workspaceId: workspaceIdParam, projectId: projectIdParam } =
    useParams<{
      workspaceId: string;
      projectId: string;
    }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const projectId = Number(projectIdParam);
  const params = Object.fromEntries(searchParams.entries());

  const [config, setConfig] = useState<IssuesQueryConfig>({
    groupBy: (params.groupBy as IssueGroupBy) || 'status',
    sortBy: params.sortBy || 'createdAt',
    sortOrder: params.sortOrder as 'asc' | 'desc',
    statuses: params.statuses?.split(',') as IssueStatus[] | undefined,
    priorities: params.priorities?.split(',') as IssuePriority[] | undefined,
    projectIds: projectId
      ? [Number(projectId)]
      : params.projectIds?.split(',').map(Number),
  });

  const { groupBy } = config;
  const strategy = GROUPING_CONFIG[groupBy || 'status'];

  const [localColumns, setLocalColumns] = useState<Columns | null>(null);

  const [activeNode, setActiveNode] = useState<React.ReactNode | null>(null);

  const workspaceId = Number(workspaceIdParam);
  const {
    data: issues,
    updateIssue,
    isLoading: issuesLoading,
  } = useIssues(workspaceId, config);
  const { data: projects, isLoading: projectsLoading } = useProjects(
    workspaceId,
    { enabled: groupBy === 'project' }
  );

  const items = useMemo(() => {
    const base =
      groupBy === 'project' ? strategy.getItems(projects) : strategy.getItems();

    const extra = strategy.getExtraItems?.() || [];
    return [...base, ...extra];
  }, [groupBy, projects, strategy]);

  const memoColumns = useMemo(() => {
    const columns: Columns = {};
    items.forEach(item => {
      columns[item.id] = {
        id: item.id,
        name: item.name,
        icon: item.icon,
        issues: issues[item.key] || [],
      };
    });
    return columns;
  }, [items, issues]);

  const columns = localColumns ?? memoColumns;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(
    () =>
      setSearchParams(
        prev => {
          const params = new URLSearchParams(prev);
          if (config.groupBy) params.set('groupBy', config.groupBy);
          if (config.sortBy) params.set('sortBy', config.sortBy);
          if (config.sortOrder) params.set('sortOrder', config.sortOrder);
          if (config.statuses?.length)
            params.set('statuses', config.statuses.join(','));
          else params.delete('statuses');
          if (config.priorities?.length)
            params.set('priorities', config.priorities.join(','));
          else params.delete('priorities');
          if (!projectId && config.projectIds?.length)
            params.set('projectIds', config.projectIds.join(','));
          else params.delete('projectIds');
          return params;
        },
        { replace: true }
      ),
    [config, projectId, searchParams, setSearchParams]
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    const element = event.active.data.current?.element;
    setActiveNode(element || null);
  }, []);

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveNode(null);
      const { active, over } = event;

      const currentColumns = localColumns ?? memoColumns;

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

      const activeIssue = currentColumns[activeContainer].issues.find(
        i => i.id.toString() === activeId
      );
      if (!activeIssue) return;

      let overIndex = currentColumns[overContainer].issues.length;
      if (over && over.id.toString() !== activeId) {
        overIndex = currentColumns[overContainer].issues.findIndex(
          issue => issue.id.toString() === over.id.toString()
        );
      }

      const sourceIssues = [...currentColumns[activeContainer].issues];
      const destIssues = [...currentColumns[overContainer].issues];
      const sourceIndex = sourceIssues.findIndex(
        i => i.id.toString() === activeId
      );
      sourceIssues.splice(sourceIndex, 1);
      const updatedIssue: IssueEdit = {
        ...activeIssue,
        ...strategy.getFieldUpdate(overContainer.toString()),
      };
      destIssues.splice(overIndex, 0, updatedIssue);

      const updatedColumns: Columns = {
        ...currentColumns,
        [activeContainer]: {
          ...currentColumns[activeContainer],
          issues: sourceIssues,
        },
        [overContainer]: {
          ...currentColumns[overContainer],
          issues: destIssues,
        },
      };

      setLocalColumns(updatedColumns);

      try {
        await updateIssue(updatedIssue);
      } catch (err) {
        const error = err as Error;
        toast(error.message || 'Failed to update issue');
        setLocalColumns(currentColumns);
      } finally {
        setLocalColumns(null);
      }
    },
    [strategy, localColumns, memoColumns, updateIssue]
  );

  const openDialog = (initValue: string) => {
    const initValues = strategy.getFieldUpdate(initValue);
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
          projectId={projectId}
        />
      </div>
      {issuesLoading || projectsLoading ? (
        <div className="flex flex-row justify-center w-full md:w-screen">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col md:w-fit">
          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="grid md:grid-cols-3 lg:flex lg:flex-row lg:mr-4 gap-2 w-full md:w-fit">
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
