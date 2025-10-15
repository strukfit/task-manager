import { ISSUE_STATUS_COLUMNS, IssueStatus } from '@/constants/issue';
import { useIssues } from '@/hooks/use-issues';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  rectIntersection,
} from '@dnd-kit/core';
import { toast } from 'sonner';
import { Columns } from '@/types/board';
import DroppableColumn from '@/components/board/droppable-column';
import BoardShell from '@/components/board/board-shell';

export default function Page() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [columns, setColumns] = useState<Columns>(
    Object.values(ISSUE_STATUS_COLUMNS).reduce(
      (acc, col) => ({ ...acc, [col.id]: { ...col, issues: [] } }),
      {} as Columns
    )
  );
  // const [projectId, setProjectId] = useState<number | null>(null);

  const { data: issues, updateIssue } = useIssues(Number(workspaceId));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setColumns(
      (Object.keys(ISSUE_STATUS_COLUMNS) as IssueStatus[]).reduce(
        (acc, status) => ({
          ...acc,
          [status]: {
            ...ISSUE_STATUS_COLUMNS[status],
            issues: issues[status] || [],
          },
        }),
        {} as Columns
      )
    );
  }, [issues]);

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = active.id.toString();
    const activeContainer = active.data.current?.sortable
      .containerId as IssueStatus;

    let overContainer: IssueStatus;
    if (over) {
      overContainer = (over.data.current?.sortable.containerId ||
        over.id) as IssueStatus;
    } else {
      const collisions = event.collisions;
      if (!collisions || collisions.length <= 0) return;
      overContainer = collisions[0].id as IssueStatus;
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
    destIssues.splice(overIndex, 0, { ...activeIssue, status: overContainer });

    setColumns({
      ...columns,
      [activeContainer]: { ...columns[activeContainer], issues: sourceIssues },
      [overContainer]: { ...columns[overContainer], issues: destIssues },
    });

    try {
      await updateIssue({
        ...activeIssue,
        status: overContainer,
      });
    } catch (err) {
      const error = err as Error;
      toast(error.message || 'Failed to update issue');
      setColumns(columns);
    }
  };

  return (
    <BoardShell>
      <div className="flex flex-col min-h-screen p-4">
        {/* <div className="flex justify-start items-start mb-4">
          <ProjectFilter workspaceId={workspaceId} onProjectChange={setProjectId} />
        </div> */}
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragEnd={onDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 flex-1">
            {Object.entries(columns).map(([columnId, column]) => (
              <DroppableColumn
                key={columnId}
                columnId={columnId}
                column={column}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </BoardShell>
  );
}
