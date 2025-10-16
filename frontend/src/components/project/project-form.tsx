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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useProjectById, useProjects } from '@/hooks/use-projects';
import {
  createProjectSchema,
  editProjectSchema,
  ProjectCreate,
  ProjectEdit,
} from '@/schemas/project';

interface IssueFormProps {
  projectId?: number;
  onSuccess: () => void;
}

export default function IssueForm({ projectId, onSuccess }: IssueFormProps) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { project, isLoading: projectLoading } = useProjectById(
    Number(workspaceId),
    projectId
  );
  const { createProject, updateProject } = useProjects(Number(workspaceId));

  const projectSchema = projectId ? editProjectSchema : createProjectSchema;

  const form = useForm<ProjectCreate | ProjectEdit>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (projectId && project) {
      form.reset(project);
    }
  }, [project, form, projectId]);

  const onSubmit = async (values: ProjectCreate | ProjectEdit) => {
    try {
      if (projectId) {
        await updateProject(values as ProjectEdit);
      } else {
        await createProject(values as ProjectCreate);
      }
      onSuccess();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to save issue');
    }
  };

  if (projectLoading && projectId) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
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
        <Button type="submit" disabled={projectLoading}>
          Save
        </Button>
      </form>
    </Form>
  );
}
