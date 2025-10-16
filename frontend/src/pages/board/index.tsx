import BoardShell from '@/components/board/board-shell';
import IssuesBoard from '@/components/issue/issues-board';

export default function Page() {
  return (
    <BoardShell>
      <IssuesBoard />
    </BoardShell>
  );
}
