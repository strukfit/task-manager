import { useAuth } from '@/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  CircleUserRound,
  LogOutIcon,
  UserRoundPen,
} from 'lucide-react';
import { Link } from 'react-router';
import { useSidebar } from '@/components/ui/sidebar';

export default function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b flex flex-row items-center justify-between p-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex rounded-none w-full h-full justify-between font-normal ${!isExpanded && 'px-2'}`}
            >
              <div className="flex items-center gap-2">
                <CircleUserRound className="!h-8 !w-8" />
                {isExpanded && (
                  <div className="flex flex-col justify-start">
                    <span className="text-sm text-left font-semibold truncate select-none">
                      {user?.username || 'User'}
                    </span>
                    <span className="text-sm text-left font-base truncate select-none">
                      {user?.email || 'Email'}
                    </span>
                  </div>
                )}
              </div>
              {isExpanded && <ChevronDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link to="/profile">
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
  );
}
