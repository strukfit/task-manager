import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import IssuesBoard from '@/components/issue/issues-board';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectById } from '@/hooks/use-projects';
import { editProjectSchema, Project, ProjectEdit } from '@/schemas/project';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Ellipsis, Loader2, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { EditableText } from '@/components/common/editable-text';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { useBoardLayout } from '@/hooks/use-board-layout';
import { useWorkspaceById } from '@/hooks/use-workspaces';

type PageTabs = 'overview' | 'issues';

export default function ProjectOverviewPage() {
  const { workspaceId: workspaceIdStr, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const workspaceId = Number(workspaceIdStr);
  const {
    project,
    updateProject,
    deleteProject,
    isLoading: projectLoading,
  } = useProjectById(workspaceId, Number(projectId));
  const { workspace } = useWorkspaceById(workspaceId);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as PageTabs | null) ?? 'overview';

  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { setHeader } = useBoardLayout();

  const form = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      id: project?.id,
      name: project?.name || '',
      description: project?.description || '',
    },
  });

  const setActiveTab = useCallback(
    (tab: PageTabs) => {
      setSearchParams(
        prev => {
          const params = new URLSearchParams(prev);
          params.set('tab', tab);
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    setHeader(
      <div className="flex flex-row items-center gap-2 w-full">
        <Breadcrumb className="ml-2 flex-1 min-w-0">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbPage className="truncate max-w-[100px]">
                {workspace?.name || 'Workspace'}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />

            <BreadcrumbItem>
              <Link
                to={`/workspaces/${workspaceId}/projects`}
                className="truncate"
              >
                Projects
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[120px]">
                {project?.name || 'Project'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
    return () => setHeader(null);
  }, [setHeader, project, workspace, workspaceId, setIsDeleteDialogOpen]);

  useEffect(() => {
    if (project) {
      form.reset(project);
    }
  }, [project, form]);

  const handleSave = async (field: keyof ProjectEdit, value: string) => {
    if (!project) return;
    try {
      await updateProject({
        id: project.id,
        name: field === 'name' ? value.trim() : project.name,
        description:
          field === 'description'
            ? value.trim() || undefined
            : project.description,
      });
      toast.success('Project updated');
    } catch {
      toast.error(`Failed to update ${field}`);
      form.setValue(field, project[field as keyof Project] as string);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!project) return;
    try {
      await deleteProject(project.id);
      toast.success('Project deleted successfully');
      navigate(`/workspaces/${workspaceId}/projects`);
    } catch {
      toast.error('Failed to delete project');
    }
  }, [project, deleteProject, navigate, workspaceId]);

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <FormProvider {...form}>
        <div className="flex flex-col gap-4 p-4 md:p-0">
          <Tabs
            value={activeTab}
            onValueChange={value => setActiveTab(value as PageTabs)}
          >
            <TabsList className="grid w-full md:w-fit grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card className="rounded-sm shadow-sm border-0 max-h-[80vh] overflow-y-auto">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl">
                      <EditableText<ProjectEdit>
                        fieldName="name"
                        onSave={handleSave}
                        editor="input"
                        placeholder="Project name"
                        displayContent={v => (
                          <span className="truncate">{v}</span>
                        )}
                      />
                    </CardTitle>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hidden md:flex"
                        >
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-6">
                  <EditableText<ProjectEdit>
                    fieldName="description"
                    onSave={handleSave}
                    editor="textarea"
                    placeholder="Add description..."
                    displayContent={(v, p) => (
                      <div
                        className={`prose prose-sm max-w-none ${!v ? 'text-gray-400' : ''}`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {v || p}
                        </ReactMarkdown>
                      </div>
                    )}
                    displayContainerClassName="rounded min-h-[60px] max-h-[300px] overflow-y-auto"
                    editorClassName="min-h-[100px] max-h-[300px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues" className="mt-4">
              <div className="h-full">
                <IssuesBoard />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </FormProvider>

      <ConfirmationDialog
        title="Delete Project"
        description={`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
