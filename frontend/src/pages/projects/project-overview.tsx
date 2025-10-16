import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BoardShell from '@/components/board/board-shell';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProjectById, useProjects } from '@/hooks/use-projects';
import { editProjectSchema, Project } from '@/schemas/project';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function ProjectOverviewPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const { project, isLoading: projectLoading } = useProjectById(
    Number(workspaceId),
    Number(projectId)
  );
  const { updateProject } = useProjects(Number(workspaceId));

  const form = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      id: project?.id,
      name: project?.name || '',
      description: project?.description || '',
    },
  });

  useEffect(() => {
    if (project) {
      form.reset(project);
    }
  }, [project, form]);

  const handleSave = async (field: keyof Project, value: string) => {
    if (!project) return;
    try {
      await updateProject({
        id: project.id,
        name: field === 'name' ? value : project.name,
        description:
          field === 'description' ? value || undefined : project.description,
      });
      toast.success(
        `${field === 'name' ? 'Name' : 'Description'} updated successfully`
      );
    } catch (error) {
      toast.error(
        `Failed to update ${field === 'name' ? 'name' : 'description'}`
      );
      if (field === 'name') form.setValue('name', project.name);
      else form.setValue('description', project.description || '');
    }
  };

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <BoardShell
      header={
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
      }
    >
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <div>
                    <Input
                      {...form.register('name')}
                      onBlur={form.handleSubmit(data => {
                        handleSave('name', data.name);
                      })}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(data => {
                            handleSave('name', data.name);
                          })();
                        }
                      }}
                      className="w-full"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Description</h3>
                  <div>
                    <Textarea
                      {...form.register('description')}
                      onBlur={form.handleSubmit(data => {
                        handleSave('description', data.description || '');
                      })}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(data => {
                            handleSave('description', data.description || '');
                          })();
                        }
                      }}
                      className="w-full"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues">
            <IssuesBoard />
          </TabsContent>
        </Tabs>
      </div>
    </BoardShell>
  );
}
