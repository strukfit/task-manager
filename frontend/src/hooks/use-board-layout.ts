import { BoardLayoutContext } from '@/types/board';
import { useOutletContext } from 'react-router';

export function useBoardLayout() {
  return useOutletContext<BoardLayoutContext>();
}
