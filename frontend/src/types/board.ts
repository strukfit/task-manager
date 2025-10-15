import { IssueStatus } from '@/constants/issue';
import { Issue } from '@/schemas/issue';

export interface Column {
  id: IssueStatus;
  name: string;
  issues: Issue[];
}

export type Columns = Record<IssueStatus, Column>;
