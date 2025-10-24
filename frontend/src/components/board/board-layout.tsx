import { Outlet } from 'react-router';
import BoardShell from '@/components/board/board-shell';
import { useState } from 'react';
import { BoardLayoutContext } from '@/types/board';

export default function BoardLayout() {
  const [header, setHeader] = useState<React.ReactNode>(null);

  return (
    <BoardShell header={header}>
      <Outlet context={{ setHeader } satisfies BoardLayoutContext} />
    </BoardShell>
  );
}
