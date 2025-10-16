import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import BoardSidebar from './board-sidebar';

interface BoardShellProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function BoardShell({ header, children }: BoardShellProps) {
  return (
    <SidebarProvider>
      <BoardSidebar activeMenuItem={location.pathname} />
      <SidebarInset>
        <div className="p-4">
          <header className="flex flex-row items-center mb-2">
            <SidebarTrigger />
            {header}
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
