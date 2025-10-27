import { Outlet } from 'react-router';
import { useState } from 'react';
import UserSidebarShell from './user-siderbar-shell';
import { UserSidebarLayoutContext } from '@/types/user';

export default function UserSidebarLayout() {
  const [header, setHeader] = useState<React.ReactNode>(null);

  return (
    <UserSidebarShell header={header}>
      <Outlet context={{ setHeader } satisfies UserSidebarLayoutContext} />
    </UserSidebarShell>
  );
}
