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

type PageTabs = 'overview' | 'issues';

export default function ProjectOverviewPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const {
    project,
    updateProject,
    deleteProject,
    isLoading: projectLoading,
  } = useProjectById(Number(workspaceId), Number(projectId));

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
      <div className="flex flex-row items-center gap-2">
        <Breadcrumb className="ml-2">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>Workspace</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <Link to={`/workspaces/${workspaceId}/projects`}>Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project?.name || 'Project'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as PageTabs)}
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
    return () => setHeader(null);
  }, [setHeader, project, workspaceId, activeTab, setActiveTab]);

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
    } catch {
      toast.error(
        `Failed to update ${field === 'name' ? 'name' : 'description'}`
      );
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
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <FormProvider {...form}>
        <div className="flex flex-1 flex-col md:flex-row gap-4 p-0">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="overview">
              <div className="flex-1 h-full">
                <Card className="flex-1 flex flex-col rounded-sm h-full pt-2 pb-6">
                  <CardHeader className="p-0">
                    <div className="flex flex-row justify-end px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8">
                            <Ellipsis className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onClick={() => setIsDeleteDialogOpen(true)}
                            asChild
                          >
                            <div>
                              <Trash className="h-4 w-4" />
                              Delete project
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-2xl px-6">
                      <EditableText<ProjectEdit>
                        fieldName="name"
                        onSave={handleSave}
                        editor="input"
                        placeholder="No name"
                        displayContent={v => v}
                        displayContainerClassName=""
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <EditableText<ProjectEdit>
                      fieldName="description"
                      onSave={handleSave}
                      editor="textarea"
                      placeholder="Add description..."
                      displayContent={(v, p) => (
                        <div className={`prose ${!v ? 'text-gray-400' : ''}`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {v || p}
                          </ReactMarkdown>
                        </div>
                      )}
                      displayContainerClassName="rounded"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="issues">
              <IssuesBoard />
            </TabsContent>
          </Tabs>
        </div>
      </FormProvider>
      <ConfirmationDialog
        title="Delete Project"
        description={`Are you sure you want to delete the project "${project?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
