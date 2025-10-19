import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BoardShell from '@/components/board/board-shell';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIssueById } from '@/hooks/use-issues';
import { editIssueSchema, Issue, IssueEdit } from '@/schemas/issue';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { IssuePriority, IssueStatus } from '@/constants/issue';
import { useProjects } from '@/hooks/use-projects';
import { EditableText } from '@/components/common/editable-text';
import remarkGfm from 'remark-gfm';
import { PrioritySelect } from '@/components/issue/priority-select';
import { StatusSelect } from '@/components/issue/status-select';
import { ProjectSelect } from '@/components/issue/project-select';

export default function IssueOverviewPage() {
  const { workspaceId: workspaceIdStr, issueId: issueIdStr } = useParams<{
    workspaceId: string;
    issueId: string;
  }>();
  const workspaceId = Number(workspaceIdStr);
  const issueId = Number(issueIdStr);
  const {
    issue,
    isLoading: issueLoading,
    updateIssue,
  } = useIssueById(workspaceId, issueId);
  const { data: projects } = useProjects(workspaceId);

  const form = useForm<IssueEdit>({
    resolver: zodResolver(editIssueSchema),
    defaultValues: {
      id: issue?.id,
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'NONE',
      status: issue?.status || 'TO_DO',
      projectId: issue?.project?.id || -1,
    },
  });

  useEffect(() => {
    if (issue) {
      form.reset({
        id: issue.id,
        title: issue.title || '',
        description: issue.description || '',
        priority: issue.priority || 'NONE',
        status: issue.status || 'TO_DO',
        projectId: issue.project?.id || -1,
      });
    }
  }, [issue, form]);

  const handleSave = async (field: keyof IssueEdit, value: string) => {
    if (!issue) return;
    try {
      const updatedIssue: IssueEdit = {
        id: issue.id,
        title: field === 'title' ? value.trim() : issue.title,
        description:
          field === 'description'
            ? value.trim() || undefined
            : issue.description,
        priority:
          field === 'priority' ? (value as IssuePriority) : issue.priority,
        status: field === 'status' ? (value as IssueStatus) : issue.status,
        projectId:
          field === 'projectId' ? Number(value) : issue.project?.id || -1,
      };
      await updateIssue(updatedIssue);
      // toast.success(`${field} updated successfully`);
    } catch (error) {
      toast.error(
        `Failed to update ${field === 'projectId' ? 'project' : field}`
      );
      if (field === 'projectId') {
        form.setValue(field, issue.project?.id || -1);
        return;
      }
      form.setValue(field, issue[field as keyof Issue] as string);
    }
  };

  if (issueLoading) {
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
              <Link to={`/workspaces/${workspaceId}`}>Board</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{issue?.title || 'Issue'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <FormProvider {...form}>
        <div className="flex flex-1 flex-col md:flex-row gap-4 p-4">
          <div className="flex-1 w-[85%]">
            <Card className="flex-1 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-2xl">
                  <EditableText
                    fieldName="title"
                    onSave={handleSave}
                    editor="input"
                    placeholder="No title"
                    displayContent={v => v}
                    displayContainerClassName=""
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 w-full">
                <EditableText
                  fieldName="description"
                  onSave={handleSave}
                  editor="textarea"
                  placeholder="Add description..."
                  displayContent={(v, p) => (
                    <div
                      className={`prose break-words max-w-none ${!v ? 'text-gray-400' : ''}`}
                    >
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
          <div className="flex flex-col w-[15%]">
            <Card className="flex-1 flex flex-col">
              <CardContent className="space-y-4">
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="font-bold select-none">Properties</p>
                    <PrioritySelect
                      form={form}
                      onValueChange={v => handleSave('priority', v)}
                      className="w-full"
                    />
                    <StatusSelect
                      form={form}
                      onValueChange={v => handleSave('status', v)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="font-bold select-none">Project</p>
                    <ProjectSelect
                      form={form}
                      projects={projects || []}
                      onValueChange={v => handleSave('projectId', v)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </FormProvider>
    </BoardShell>
  );
}
