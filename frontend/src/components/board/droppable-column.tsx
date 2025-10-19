import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SortableIssue from '../issue/sortable-issue';
import { useDroppable } from '@dnd-kit/core';
import { Column } from '@/types/board';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { IssueStatus } from '@/constants/issue';

interface DroppableColumnProps {
  columnId: string;
  column: Column;
  icon: React.ReactNode;
  onOpenCreateDialog?: (initStatus: IssueStatus) => void;
}

export default function DroppableColumn({
  columnId,
  column,
  icon,
  onOpenCreateDialog,
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`bg-gray-50 flex flex-col h-full rounded-sm lg:w-sm py-4 gap-2 ${isOver ? 'bg-blue-100' : ''}`}
      >
        <CardHeader className="px-4">
          <CardTitle className="flex flex-row items-center justify-between select-none">
            <div className="flex flex-row gap-2">
              {icon}
              {column.name}
            </div>
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm rounded-sm h-7 w-7"
                onClick={() => onOpenCreateDialog?.(column.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="flex-1 min-h-[200px] px-4">
          <SortableContext
            id={columnId}
            items={column.issues.map(i => i.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {column.issues.length !== 0 && (
                <div className="flex flex-1 flex-col gap-2">
                  {column.issues.map(issue => (
                    <SortableIssue
                      key={issue.id.toString()}
                      id={issue.id.toString()}
                      issue={issue}
                    />
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                hidden={!isHovered}
                className="w-full text-sm"
                onClick={() => onOpenCreateDialog?.(column.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
