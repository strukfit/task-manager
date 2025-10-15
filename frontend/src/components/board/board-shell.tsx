import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import BoardSidebar from './board-sidebar';

interface BoardShellProps {
  children: React.ReactNode;
}

export default function BoardShell({ children }: BoardShellProps) {
  return (
    <SidebarProvider>
      <BoardSidebar activeMenuItem={location.pathname} />
      <SidebarInset>
        <div className="p-4">
          <SidebarTrigger />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
