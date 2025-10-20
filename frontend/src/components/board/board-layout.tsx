import { Outlet, useOutletContext } from 'react-router';
import BoardShell from '@/components/board/board-shell';
import { useState } from 'react';

interface BoardLayoutContext {
  setHeader: (header: React.ReactNode) => void;
}

export default function BoardLayout() {
  const [header, setHeader] = useState<React.ReactNode>(null);

  return (
    <BoardShell header={header}>
      <Outlet context={{ setHeader } satisfies BoardLayoutContext} />
    </BoardShell>
  );
}

export function useBoardLayout() {
  return useOutletContext<BoardLayoutContext>();
}
