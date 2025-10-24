import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/schemas/project';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, SquareChartGantt, Trash } from 'lucide-react';
import { Link } from 'react-router';

interface ColumnsProps {
  workspaceId?: number;
  onDeleteClick: (project: Project) => void;
}

export const columns = ({
  workspaceId,
  onDeleteClick,
}: ColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Create Date',
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span>{`${date.toLocaleDateString()}`}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <Link to={`/workspaces/${workspaceId}/projects/${row.original.id}`}>
            <DropdownMenuItem asChild>
              <div>
                <SquareChartGantt className="h-4 w-4" />
                Overview
              </div>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => onDeleteClick(row.original)} asChild>
            <div>
              <Trash className="h-4 w-4" />
              Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
