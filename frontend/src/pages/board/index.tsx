import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ISSUE_STATUS_COLUMNS, IssueStatus } from '@/constants/issue';
import { useIssues } from '@/hooks/use-issues';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableIssue from '@/components/issue/sortable-issue';
import { Issue } from '@/schemas/issue';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import IssueForm from '@/components/issue/issue-form';

interface Column {
  id: IssueStatus;
  name: string;
  issues: Issue[];
}

type Columns = Record<IssueStatus, Column>;

export default function Page() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [open, setOpen] = useState(false);
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

    if (!over) return;

    const activeId = active.id;
    const activeContainer = active.data.current?.sortable
      .containerId as IssueStatus;
    const overId = over.id;
    const overContainer = (over.data.current?.sortable.containerId ||
      over.id) as IssueStatus;

    if (activeContainer === overContainer) return;

    const activeIssue = columns[activeContainer].issues.find(
      i => i.id.toString() === activeId
    );
    if (!activeIssue) return;

    let overIndex = columns[overContainer].issues.length; // append by default

    if (overId && overId !== activeId) {
      overIndex = columns[overContainer].issues.findIndex(
        issue => issue.id.toString() === overId
      );
    }

    // Optimistic update
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
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Board</h2>
        <div className="flex items-center space-x-2">
          {/* <ProjectFilter workspaceId={workspaceId} onProjectChange={setProjectId} /> */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Create Issue</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Issue</DialogTitle>
              </DialogHeader>
              <IssueForm
                onSuccess={() => {
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={onDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId}>
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle>{column.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    id={columnId}
                    items={column.issues.map(i => i.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    {column.issues.map(issue => (
                      <SortableIssue
                        key={issue.id.toString()}
                        id={issue.id.toString()}
                        issue={issue}
                      />
                    ))}
                  </SortableContext>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
