import SidebarShell from '../common/sidebar-shell';
import BoardSidebar from './board-sidebar';

interface BoardShellProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function BoardShell({ header, children }: BoardShellProps) {
  return (
    <SidebarShell
      sidebar={<BoardSidebar activeMenuItem={location.pathname} />}
      header={header}
    >
      {children}
    </SidebarShell>
  );
}
