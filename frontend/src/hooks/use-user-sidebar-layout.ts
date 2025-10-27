import { UserSidebarLayoutContext } from '@/types/user';
import { useOutletContext } from 'react-router';

export function useUserSidebarLayout() {
  return useOutletContext<UserSidebarLayoutContext>();
}
