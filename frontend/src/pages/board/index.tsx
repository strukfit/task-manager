import { useBoardLayout } from '@/hooks/use-board-layout';
import IssuesBoard from '@/components/issue/issues-board';
import { useEffect } from 'react';

export default function BoardPage() {
  const { setHeader } = useBoardLayout();

  useEffect(() => {
    setHeader(null);
    return () => setHeader(null);
  }, [setHeader]);

  return <IssuesBoard />;
}
