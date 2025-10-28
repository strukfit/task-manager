import { Issue } from '@/schemas/issue';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IssueCard from './issue-card';
import { useMemo } from 'react';

interface SortableIssueProps {
  id: string;
  issue: Issue;
}

export default function SortableIssue({ id, issue }: SortableIssueProps) {
  const issueCard = useMemo(() => <IssueCard issue={issue} />, [issue]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      element: issueCard,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    'touch-action': 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {issueCard}
    </div>
  );
}
