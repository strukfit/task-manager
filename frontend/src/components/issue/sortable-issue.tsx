import { Issue } from '@/schemas/issue';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IssueCard from './issue-card';

interface SortableIssueProps {
  id: string;
  issue: Issue;
}

export default function SortableIssue({ id, issue }: SortableIssueProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IssueCard issue={issue} />
    </div>
  );
}
