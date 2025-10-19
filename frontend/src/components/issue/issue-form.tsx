import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIssueById } from '@/hooks/use-issues';
import {
  createIssueSchema,
  editIssueSchema,
  IssueCreate,
  IssueEdit,
} from '@/schemas/issue';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProjects } from '@/hooks/use-projects';
import { EditableText } from '@/components/common/editable-text';
import { PrioritySelect } from './priority-select';
import { StatusSelect } from './status-select';
import { ProjectSelect } from './project-select';
import { IssueStatus } from '@/constants/issue';

interface IssueFormProps {
  issueId?: number;
  initStatus?: IssueStatus;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function IssueForm({
  issueId,
  initStatus,
  onSuccess,
  onCancel,
}: IssueFormProps) {
  const { workspaceId: workspaceIdStr } = useParams<{ workspaceId: string }>();
  const workspaceId = Number(workspaceIdStr);
  const {
    issue,
    isLoading: issueLoading,
    createIssue,
    updateIssue,
  } = useIssueById(workspaceId, issueId);
  const { data: projects, isLoading: projectsLoading } =
    useProjects(workspaceId);

  const issueSchema = issueId ? editIssueSchema : createIssueSchema;

  const form = useForm<IssueCreate | IssueEdit>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      priority: issue?.priority || 'NONE',
      status: issue?.status || initStatus || 'BACKLOG',
      projectId: issue?.project?.id || -1,
    },
  });

  useEffect(() => {
    if (issueId && issue) {
      form.reset({
        ...issue,
        projectId: issue.project?.id || -1,
      });
    }
  }, [issue, form, issueId]);

  const handleSave = async (values: IssueCreate | IssueEdit) => {
    try {
      if (issueId) {
        await updateIssue(values as IssueEdit);
      } else {
        await createIssue(values as IssueCreate);
      }
      onSuccess();
      toast.success(issueId ? 'Issue updated' : 'Issue created');
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to save issue');
    }
  };

  if ((issueId && issueLoading) || projectsLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-1 flex-col gap-4">
        <EditableText
          fieldName="title"
          onSave={async (field, value) => {
            form.setValue(field as keyof IssueEdit, value);
          }}
          editor="input"
          placeholder="Issue title"
          displayContent={v => (
            <p className={`${!v ? 'text-gray-400' : ''}`}>
              {v || 'Issue title'}
            </p>
          )}
        />
        <EditableText
          fieldName="description"
          onSave={async (field, value) => {
            form.setValue(field as keyof IssueEdit, value);
          }}
          editor="textarea"
          placeholder="Add description..."
          displayContent={(v, p) => (
            <div className={`prose ${!v ? 'text-gray-400' : ''}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {v || p}
              </ReactMarkdown>
            </div>
          )}
          displayContainerClassName="rounded min-h-[60px]"
          editorClassName="min-h-[60px]"
        />
        <div className="flex flex-row gap-1">
          <PrioritySelect form={form} />
          <StatusSelect form={form} />
          <ProjectSelect form={form} projects={projects || []} />
        </div>
        <hr className="border-t border-gray-200" />
        <div className="flex flex-row gap-1 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={issueLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            onClick={form.handleSubmit(handleSave)}
            disabled={issueLoading}
          >
            {issueId ? 'Save' : 'Create Issue'}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
