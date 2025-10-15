import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import IssueForm from './issue-form';
import { Issue } from '@/schemas/issue';
import { useIssues } from '@/hooks/use-issues';
import { toast } from 'sonner';
import { useParams } from 'react-router';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const [open, setOpen] = useState(false);

  const { deleteIssue } = useIssues(Number(workspaceId));

  const handleDelete = async () => {
    try {
      await deleteIssue(issue.id);
    } catch (err) {
      const error = err as Error;
      toast(error.message || 'Failed to delete issue');
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{issue.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">
          {issue.description || 'No description'}
        </p>
        <p className="text-sm font-semibold mt-2">Priority: {issue.priority}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Issue</DialogTitle>
              </DialogHeader>
              <IssueForm issueId={issue.id} onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
