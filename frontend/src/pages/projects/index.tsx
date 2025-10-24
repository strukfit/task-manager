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
import { useBoardLayout } from '@/hooks/use-board-layout';
import { Paginator } from '@/components/common/paginator';

const COLUMN_TO_SORT_FIELD: Record<string, string> = {
  name: 'name',
  createdAt: 'createdAt',
};

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number.parseInt(searchParams.get('page') || '1', 10);
  const pageSize = Number.parseInt(searchParams.get('limit') || '20', 10);

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { setHeader } = useBoardLayout();

  const sortParam = searchParams.get('sortBy');
  const sortOrderParam = searchParams.get('sortOrder');

  const sorting: SortingState =
    sortParam && (sortOrderParam === 'asc' || sortOrderParam === 'desc')
      ? [{ id: sortParam, desc: sortOrderParam === 'desc' }]
      : [];

  const { workspaceId } = useParams<{ workspaceId: string }>();
  const {
    data: projects,
    pagination,
    deleteProject,
  } = useProjects(Number(workspaceId), {
    page: currentPage - 1,
    size: pageSize,
    sortBy:
      sorting.length > 0
        ? COLUMN_TO_SORT_FIELD[sorting[0].id] || undefined
        : undefined,
    sortOrder:
      sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
  });

  useEffect(() => {
    setHeader(
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
    );
    return () => setHeader(null);
  }, [setHeader]);

  const handleOverview = (id: number) => {
    navigate(`/workspaces/${workspaceId}/projects/${id}`);
  };

  const handleDeleteClick = useCallback((project: Project) => {
    if (project) {
      setProjectToDelete(project);
      setIsDeleteDialogOpen(true);
    }
  }, []);

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

  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  return (
    <>
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
      <div className="flex mt-8">
        <Paginator
          currentPage={pagination.page + 1}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmationDialog
        title="Delete Project"
        description={`Are you sure you want to delete the project "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
