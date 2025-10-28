import UserSidebar from './user-sidebar';
import SidebarShell from '../common/sidebar-shell';

interface WorkspacesShellProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function UserSidebarShell({
  header,
  children,
}: WorkspacesShellProps) {
  return (
    <SidebarShell
      sidebar={<UserSidebar activeMenuItem={location.pathname} />}
      header={header}
    >
      {children}
    </SidebarShell>
  );
}
