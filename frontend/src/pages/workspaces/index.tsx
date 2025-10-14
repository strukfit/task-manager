import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Link } from 'react-router';

export default function WorkspaceList() {
  const { data: workspaces, isLoading: loading, error } = useWorkspaces();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <Link to="/workspaces/create">
            <Button>Create Workspace</Button>
          </Link>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error.message}</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map(workspace => (
            <Card key={workspace.id}>
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {workspace.description || 'No description'}
                </p>
                <div className="mt-4 flex justify-between">
                  <Link to={`/workspaces/${workspace.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link to={`/workspaces/${workspace.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
