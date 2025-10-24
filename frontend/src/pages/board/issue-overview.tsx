import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Ellipsis, Loader2, Trash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { IssuePriority, IssueStatus } from '@/constants/issue';
import { useProjects } from '@/hooks/use-projects';
import { EditableText } from '@/components/common/editable-text';
import remarkGfm from 'remark-gfm';
import { PrioritySelect } from '@/components/issue/priority-select';
import { StatusSelect } from '@/components/issue/status-select';
import { ProjectSelect } from '@/components/issue/project-select';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBoardLayout } from '@/hooks/use-board-layout';

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
    deleteIssue,
  } = useIssueById(workspaceId, issueId);
  const { data: projects, isLoading: projectsLoading } =
    useProjects(workspaceId);
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { setHeader } = useBoardLayout();

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
    setHeader(
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
    );
    return () => setHeader(null);
  }, [setHeader, issue, workspaceId]);

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

  const handleSave = useCallback(
    async (field: keyof IssueEdit, value: string) => {
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
      } catch {
        toast.error(
          `Failed to update ${field === 'projectId' ? 'project' : field}`
        );
        if (field === 'projectId') {
          form.setValue(field, issue.project?.id || -1);
          return;
        }
        form.setValue(field, issue[field as keyof Issue] as string);
      }
    },
    [issue, form, updateIssue]
  );

  const handleDelete = useCallback(async () => {
    if (!issue) return;
    try {
      await deleteIssue(issue.id);
      toast.success('Issue deleted successfully');
      navigate(`/workspaces/${workspaceId}`);
    } catch {
      toast.error('Failed to delete issue');
    }
  }, [issue, deleteIssue, navigate, workspaceId]);

  if (issueLoading || projectsLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <FormProvider {...form}>
        <div className="flex flex-1 flex-col md:flex-row gap-2 w-full max-w-full">
          <div className="flex w-full md:max-w-[85%]">
            <Card className="flex-1 flex flex-col rounded-sm max-w-full w-full h-full">
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
              <CardContent className="space-y-6 w-full max-w-full">
                <EditableText
                  fieldName="description"
                  onSave={handleSave}
                  editor="textarea"
                  placeholder="Add description..."
                  displayContent={(v, p) => (
                    <div
                      className={`prose break-words max-w-full ${!v ? 'text-gray-400' : ''}`}
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
          <div className="w-full flex flex-col md:w-auto md:max-w-[15%]">
            <Card className="flex flex-col rounded-sm py-2 gap-0 h-full">
              <CardHeader className="flex flex-row justify-end px-4">
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
                        Delete issue
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="px-4">
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
      <ConfirmationDialog
        title="Delete Issue"
        description={`Are you sure you want to delete the issue "${issue?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
