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
      <SidebarInset className="max-w-[calc(100%-var(--sidebar-width))]">
        <div className="h-screen flex flex-col w-full max-w-full">
          <header className="flex flex-row items-center p-4 pb-0 mb-2">
            <SidebarTrigger />
            {header}
          </header>
          <div className="flex flex-1 flex-col p-4 pt-0 w-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
