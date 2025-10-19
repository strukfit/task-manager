import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { editIssueSchema, Issue, IssueEdit } from '@/schemas/issue';
import { useNavigate, useParams } from 'react-router';
import { PrioritySelect } from './priority-select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getProjectIcon,
  getStatusIcon,
  IssuePriority,
} from '@/constants/issue';
import { useIssues } from '@/hooks/use-issues';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { updateIssue } = useIssues(Number(workspaceId));
  const navigate = useNavigate();

  const form = useForm<IssueEdit>({
    resolver: zodResolver(editIssueSchema),
    defaultValues: {
      priority: issue.priority,
    },
  });

  const handleSave = async (field: keyof IssueEdit, value: string) => {
    if (!issue) return;
    try {
      const updatedIssue: IssueEdit = {
        ...issue,
        priority:
          field === 'priority' ? (value as IssuePriority) : issue.priority,
      };
      await updateIssue(updatedIssue);
    } catch (error) {
      toast.error(
        `Failed to update ${field === 'projectId' ? 'project' : field}`
      );
      if (field === 'projectId') {
        form.setValue(field, issue.project?.id || -1);
        return;
      }
      form.setValue(field, issue[field as keyof Issue] as string);
    }
  };

  const handleCardClick = () => {
    navigate(`/workspaces/${workspaceId}/issues/${issue.id}`);
  };

  const handleProjectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (issue.project?.id) {
      navigate(`/workspaces/${workspaceId}/projects/${issue.project.id}`);
    }
  };

  return (
    <Card
      className="bg-white p-2 gap-0 select-none w-full rounded-sm"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center py-1 px-2 w-full">
        <div className="shrink-0">{getStatusIcon(issue.status)}</div>
        <CardTitle className="items-center truncate py-1">
          {issue.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row p-2 pt-0 gap-1">
        <PrioritySelect
          form={form}
          onValueChange={v => handleSave('priority', v)}
          showValue={false}
          className="p-2 !h-6"
        />
        {issue.project && (
          <Button
            size="sm"
            variant="outline"
            className="items-center text-xs !h-6 max-w-[150px] rounded-sm"
            onClick={handleProjectClick}
          >
            <div className="shrink-0">
              {getProjectIcon(issue.project.id.toString(), 2)}
            </div>
            <span className="truncate">{issue.project.name}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
