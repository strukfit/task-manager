import { useAuth } from '@/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '../ui/sidebar';
import { Link, useParams } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import {
  Building2,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  SquarePen,
} from 'lucide-react';
import { useWorkspaceById } from '@/hooks/use-workspaces';
import { CreateIssueDialog } from '../issue/create-issue-dialog';

const navItems = [
  {
    title: 'Board',
    items: [
      {
        title: 'Issues',
        url: (workspaceId: number) => `/workspaces/${workspaceId}`,
        icon: <ClipboardList className="h-4 w-4" />,
      },
      {
        title: 'Projects',
        url: (workspaceId: number) => `/workspaces/${workspaceId}/projects`,
        icon: <FolderKanban className="h-4 w-4" />,
      },
    ],
  },
];

export default function BoardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { workspace } = useWorkspaceById(Number(workspaceId));

  if (!workspace) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b px-6 py-3 flex flex-row items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-start max-w-[70%]"
            >
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-semibold truncate">
                {workspace.name}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link to={`/workspaces/${workspaceId}/settings`}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/workspaces">Workspaces</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateIssueDialog
          trigger={
            <Button>
              <SquarePen className="h-4 w-4 shrink-0" />
            </Button>
          }
        />
      </SidebarHeader>
      <SidebarContent>
        {navItems.map(group => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={props.activeMenuItem === item.url(workspace.id)}
                    >
                      <Link to={item.url(workspace.id)}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
