import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Issue } from '@/schemas/issue';
import { useNavigate, useParams } from 'react-router';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/workspaces/${workspaceId}/issues/${issue.id}`);
  };

  return (
    <Card className="bg-white" onClick={handleCardClick}>
      <CardHeader className="p-4">
        <CardTitle className="text-base">{issue.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">
          {issue.description || 'No description'}
        </p>
        <p className="text-sm font-semibold mt-2">Priority: {issue.priority}</p>
      </CardContent>
    </Card>
  );
}
