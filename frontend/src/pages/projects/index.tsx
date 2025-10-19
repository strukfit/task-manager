import BoardShell from '@/components/board/board-shell';
import { DataTable } from '@/components/common/data-table';
import { columns } from './columns';
import { useProjects } from '@/hooks/use-projects';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { SortingState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from '@/components/project/create-project-dialog';
import { Plus } from 'lucide-react';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Project } from '@/schemas/project';

const COLUMN_TO_SORT_FIELD: Record<string, string> = {
  name: 'name',
};

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: projects, deleteProject } = useProjects(Number(workspaceId));

  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const sortParam = searchParams.get('sortBy');
  const sortOrderParam = searchParams.get('sortOrder');

  useEffect(() => {
    if (sortParam && (sortOrderParam === 'asc' || sortOrderParam === 'desc')) {
      setSorting([{ id: sortParam, desc: sortOrderParam === 'desc' }]);
    } else {
      setSorting([]);
    }
  }, [sortParam, sortOrderParam]);

  const handleOverview = (id: number) => {
    navigate(`/workspaces/${workspaceId}/projects/${id}`);
  };

  const handleDeleteClick = useCallback(
    (id: number) => {
      const project = projects?.find(p => p.id === id);
      if (project) {
        setProjectToDelete(project);
        setIsDeleteDialogOpen(true);
      }
    },
    [projects]
  );

  const handleDelete = useCallback(async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  }, [projectToDelete, deleteProject]);

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev.toString());
        const deleteParams = () => {
          newParams.delete('sortBy');
          newParams.delete('sortOrder');
        };

        if (newSorting.length > 0) {
          const backendSortField = COLUMN_TO_SORT_FIELD[newSorting[0].id];
          if (backendSortField) {
            newParams.set('sortBy', backendSortField);
            newParams.set('sortOrder', newSorting[0].desc ? 'desc' : 'asc');
          } else {
            deleteParams();
          }
        } else {
          deleteParams();
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  return (
    <BoardShell
      header={
        <div className="ml-auto">
          <CreateProjectDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            }
          />
        </div>
      }
    >
      <DataTable
        columns={columns({
          workspaceId: Number(workspaceId),
          onDeleteClick: handleDeleteClick,
        })}
        data={projects}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        onRowClick={project => handleOverview(project.id)}
        isClickable={true}
      />
      <ConfirmationDialog
        title="Delete Project"
        description={`Are you sure you want to delete the project "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </BoardShell>
  );
}
