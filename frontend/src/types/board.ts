import { Issue } from '@/schemas/issue';

export interface Column {
  id: string;
  name: string;
  icon?: React.ReactNode;
  issues: Issue[];
}

export type Columns = Record<string, Column>;

export interface BoardLayoutContext {
  setHeader: (header: React.ReactNode) => void;
}
