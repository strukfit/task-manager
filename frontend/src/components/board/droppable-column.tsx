import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SortableIssue from '../issue/sortable-issue';
import { useDroppable } from '@dnd-kit/core';
import { Column } from '@/types/board';

interface DroppableColumnProps {
  columnId: string;
  column: Column;
  icon: React.ReactNode;
}

export default function DroppableColumn({
  columnId,
  column,
  icon,
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div className="flex flex-col h-full">
      <Card
        className={`bg-gray-50 flex flex-col h-full ${isOver ? 'bg-blue-100' : ''}`}
      >
        <CardHeader>
          <CardTitle className="flex flex-row gap-2 select-none">
            {icon}
            {column.name}
          </CardTitle>
        </CardHeader>
        <CardContent ref={setNodeRef} className="flex-1 min-h-[200px] px-4">
          <SortableContext
            id={columnId}
            items={column.issues.map(i => i.id.toString())}
            strategy={verticalListSortingStrategy}
          >
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
            {column.issues.length === 0 && (
              <div className="h-full min-h-[100px] border-2 border-dashed border-gray-300 flex items-center justify-center"></div>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
