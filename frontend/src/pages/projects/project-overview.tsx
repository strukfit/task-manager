import { FormProvider, useForm } from 'react-hook-form';
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
import { useProjectById } from '@/hooks/use-projects';
import { editProjectSchema, Project } from '@/schemas/project';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EditableText } from '@/components/common/editable-text';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectOverviewPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const {
    project,
    updateProject,
    isLoading: projectLoading,
  } = useProjectById(Number(workspaceId), Number(projectId));

  const [activeTab, setActiveTab] = useState<'overview' | 'issues'>('overview');

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
        name: field === 'name' ? value.trim() : project.name,
        description:
          field === 'description'
            ? value.trim() || undefined
            : project.description,
      });
    } catch (error) {
      toast.error(
        `Failed to update ${field === 'name' ? 'name' : 'description'}`
      );
      form.setValue(field, project[field as keyof Project] as string);
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
          <Tabs value={activeTab}>
            <TabsList>
              <TabsTrigger
                value="overview"
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="issues"
                onClick={() => setActiveTab('issues')}
              >
                Issues
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      }
    >
      <FormProvider {...form}>
        <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="overview">
              <div className="flex-1">
                <Card className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      <EditableText<Project>
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
                    <EditableText<Project>
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
    </BoardShell>
  );
}
