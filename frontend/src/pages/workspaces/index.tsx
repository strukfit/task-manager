import { useWorkspaces } from '@/hooks/use-workspaces';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Loader2, Plus, SquarePen, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Workspace } from '@/schemas/workspace';
import { useUserSidebarLayout } from '@/hooks/use-user-sidebar-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

export default function WorkspacesPage() {
  const {
    data: workspaces,
    isLoading: loading,
    error,
    deleteWorkspace,
  } = useWorkspaces();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(
    null
  );

  const { setHeader } = useUserSidebarLayout();

  useEffect(() => {
    setHeader(
      <div className="flex flex-row items-center gap-2">
        <Breadcrumb className="ml-2">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="text-xl font-bold">
                Workspaces
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to="/workspaces/create">
          <Button size="icon-sm" className="rounded-sm">
            <Plus className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
    return () => setHeader(null);
  }, [setHeader]);

  const handleDelete = useCallback(async () => {
    if (!workspaceToDelete) return;
    try {
      await deleteWorkspace(workspaceToDelete.id);
      toast.success('Workspace deleted successfully');
      setWorkspaceToDelete(null);
    } catch {
      toast.error('Failed to delete workspace');
    }
  }, [workspaceToDelete, deleteWorkspace]);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 w-full">
        {loading && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {error && <p className="text-red-500">{error.message}</p>}
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 w-full">
          {workspaces?.map(workspace => (
            <Card
              key={workspace.id}
              className="rounded-sm cursor-pointer py-4 gap-2"
              onClick={e => {
                // Prevent navigation when clicking buttons or menu
                if (
                  (e.target as HTMLElement).closest('button, [role="menuitem"]')
                )
                  return;
                navigate(`/workspaces/${workspace.id}`);
              }}
            >
              <CardHeader className="flex flex-row justify-between items-center px-4">
                <CardTitle className="text-xl">{workspace.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8">
                      <Ellipsis className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/workspaces/${workspace.id}/edit`}>
                        <SquarePen className="h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setWorkspaceToDelete(workspace);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={workspaceToDelete?.id === workspace.id}
                      asChild
                    >
                      <div>
                        <Trash className="h-4 w-4" />
                        Delete
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="px-4">
                <p className="text-gray-600">
                  {workspace.description || 'No description'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ConfirmationDialog
        title="Delete Workspace"
        description={`Are you sure you want to delete the workspace "${workspaceToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
