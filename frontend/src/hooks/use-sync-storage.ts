import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/storage';
import { User } from '@/schemas/user';

export function useSyncStorageWithQueryClient(queryClient: QueryClient) {
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (
        event.type === 'updated' &&
        Array.isArray(event.query.queryKey) &&
        event.query.queryKey[0] === 'user'
      ) {
        const user = event.query.state.data as User | undefined;

        if (user) {
          storage.setItem('user', JSON.stringify(user));
        } else {
          storage.removeItem('user');
        }
      }
    });

    return unsubscribe;
  }, [queryClient]);
}
