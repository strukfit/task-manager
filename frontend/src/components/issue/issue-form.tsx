import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useIssueById, useIssues } from '@/hooks/use-issues';
import {
  createIssueSchema,
  editIssueSchema,
  IssueCreate,
  IssueEdit,
} from '@/schemas/issue';
import { ISSUE_PRIORITY_LABELS, ISSUE_STATUS_LABELS } from '@/constants/issue';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface IssueFormProps {
  issueId?: number;
  onSuccess: () => void;
}

export default function IssueForm({ issueId, onSuccess }: IssueFormProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { issue, isLoading: issueLoading } = useIssueById(
    Number(workspaceId),
    issueId
  );
  const { createIssue, updateIssue } = useIssues(Number(workspaceId));

  const issueSchema = issueId ? editIssueSchema : createIssueSchema;

  const form = useForm<IssueCreate | IssueEdit>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'NONE',
      status: 'TO_DO',
      projectId: undefined as number | undefined,
    },
  });

  const issuePriorities = Object.entries(ISSUE_PRIORITY_LABELS);
  const issueStatuses = Object.entries(ISSUE_STATUS_LABELS);

  useEffect(() => {
    if (issueId && issue) {
      form.reset(issue);
    }
  }, [issue, form, issueId]);

  const onSubmit = async (values: IssueCreate | IssueEdit) => {
    try {
      if (issueId) {
        await updateIssue(values as IssueEdit);
      } else {
        await createIssue(values as IssueCreate);
      }
      onSuccess();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to save issue');
    }
  };

  if (issueLoading && issueId) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter issue title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter issue description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => {
            console.log(field);
            return (
              <FormItem key={field.name}>
                <FormLabel>Priority</FormLabel>
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {issuePriorities.map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem key={field.name}>
              <FormLabel>Status</FormLabel>
              <Select
                key={field.value}
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueStatuses.map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <Select
                  value={field.value?.toString() || ''}
                  onValueChange={value =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {/* {projects.map(project => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={issueLoading}>
          Save
        </Button>
      </form>
    </Form>
  );
}
