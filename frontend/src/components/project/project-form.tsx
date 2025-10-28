import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FormProvider, useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useProjectById, useProjects } from '@/hooks/use-projects';
import {
  createProjectSchema,
  editProjectSchema,
  ProjectCreate,
  ProjectEdit,
} from '@/schemas/project';
import { EditableText } from '../common/editable-text';

interface ProjectFormProps {
  projectId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({
  projectId,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
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

  const handleSave = async (values: ProjectCreate | ProjectEdit) => {
    try {
      if (projectId) {
        await updateProject(values as ProjectEdit);
      } else {
        await createProject(values as ProjectCreate);
      }
      onSuccess();
      toast.success(projectId ? 'Project updated' : 'Project created');
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to save project');
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
    <FormProvider {...form}>
      <div className="flex flex-1 flex-col gap-4">
        <EditableText
          fieldName="name"
          onSave={async (field, value) => {
            form.setValue(field as keyof ProjectEdit, value);
          }}
          editor="input"
          placeholder="Project name"
          displayContent={v => (
            <p className={`${!v ? 'text-gray-400' : ''}`}>
              {v || 'Project name'}
            </p>
          )}
        />
        <EditableText
          fieldName="description"
          onSave={async (field, value) => {
            form.setValue(field as keyof ProjectEdit, value);
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
        <hr className="border-t border-gray-200" />
        <div className="flex flex-row gap-1 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={projectLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            onClick={form.handleSubmit(handleSave)}
            disabled={projectLoading}
          >
            {projectId ? 'Save' : 'Create Project'}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
