import { useAuth } from '@/hooks/use-auth';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Link, useNavigate } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  CircleUserRound,
  Ellipsis,
  Loader2,
  LogOutIcon,
  Plus,
  SquarePen,
  Trash,
  UserRoundPen,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Workspace } from '@/schemas/workspace';

export default function WorkspacesPage() {
  const {
    data: workspaces,
    isLoading: loading,
    error,
    deleteWorkspace,
  } = useWorkspaces();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(
    null
  );

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
    <SidebarProvider>
      <Sidebar collapsible="none" className="border-r h-screen">
        <SidebarHeader className="border-b flex flex-row items-center justify-between p-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex rounded-none w-full h-full justify-between font-normal"
              >
                <div className="flex items-center gap-2">
                  <CircleUserRound className="!h-8 !w-8" />
                  <div className="flex flex-col justify-start">
                    <span className="text-sm text-left font-semibold truncate select-none">
                      {user?.username || 'User'}
                    </span>
                    <span className="text-sm text-left font-base truncate select-none">
                      {user?.email || 'Email'}
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to={`/user/settings`}>
                  <UserRoundPen className="h-4 w-4" />
                  Edit profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} asChild>
                <div>
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>
        <SidebarContent />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="w-full">
        <div className="flex-1 flex flex-col p-4 gap-4 w-full">
          <header className="flex flex-row gap-2">
            <span className="font-bold text-xl">Workspaces</span>
            <Link to="/workspaces/create">
              <Button size="icon-sm" className="rounded-sm">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </header>
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {error && <p className="text-red-500">{error.message}</p>}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
            {workspaces?.map(workspace => (
              <Card
                key={workspace.id}
                className="rounded-sm cursor-pointer py-4 gap-2"
                onClick={e => {
                  // Prevent navigation when clicking buttons or menu
                  if (
                    (e.target as HTMLElement).closest(
                      'button, [role="menuitem"]'
                    )
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
      </SidebarInset>
      <ConfirmationDialog
        title="Delete Workspace"
        description={`Are you sure you want to delete the workspace "${workspaceToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </SidebarProvider>
  );
}
