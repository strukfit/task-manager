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
  useSidebar,
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
  const { state } = useSidebar();

  if (!workspace) return null;

  const isExpanded = state === 'expanded';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={`border-b flex flex-row items-center justify-between ${isExpanded ? 'px-6 py-3' : ''}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex ${isExpanded ? 'max-w-[70%]' : 'max-w-[100%]'}`}
            >
              <Building2 className="h-4 w-4" />
              {isExpanded && (
                <span className="text-sm font-semibold truncate">
                  {workspace.name}
                </span>
              )}
              {isExpanded && <ChevronDown className="h-4 w-4" />}
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
        {isExpanded && (
          <CreateIssueDialog
            trigger={
              <Button>
                <SquarePen className="h-4 w-4 shrink-0" />
              </Button>
            }
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {navItems.map(group => (
          <SidebarGroup key={group.title}>
            {isExpanded && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={props.activeMenuItem === item.url(workspace.id)}
                    >
                      <Link
                        to={item.url(workspace.id)}
                        className="flex items-center"
                      >
                        {item.icon}
                        {isExpanded && <span>{item.title}</span>}
                      </Link>
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
