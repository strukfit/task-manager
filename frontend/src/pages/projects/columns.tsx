import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/schemas/project';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

interface ColumnsProps {
  workspaceId?: number;
  deleteProject: (id: number) => void;
}

export const columns = ({
  workspaceId,
  deleteProject,
}: ColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
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
        <DropdownMenuContent align="end">
          <Link to={`/workspaces/${workspaceId}/projects/${row.original.id}`}>
            <DropdownMenuItem>Overview</DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => deleteProject(row.original.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
