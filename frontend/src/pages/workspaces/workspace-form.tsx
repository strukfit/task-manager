import { useEffect } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
import { useAuth } from '@/hooks/use-auth';
import { useWorkspaces, useWorkspaceById } from '@/hooks/use-workspaces';
import {
  createWorkspaceSchema,
  editWorkspaceSchema,
  Workspace,
} from '@/schemas/workspace';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router';
import { toast } from 'sonner';

export default function WorkspaceFormPage() {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const workspaceSchema = workspaceId
    ? editWorkspaceSchema
    : createWorkspaceSchema;
  const { createWorkspace, updateWorkspace } = useWorkspaces();
  const { workspace, isLoading: workspaceLoading } = useWorkspaceById(
    Number(workspaceId)
  );

  const baseUrl = '/workspaces';
  const redirectUrl = baseUrl + (searchParams.get('redirect') || '');

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (values: Partial<Workspace>) => {
    try {
      if (workspaceId) {
        await updateWorkspace({ id: workspaceId, ...values } as Workspace);
        toast.success('Workspace updated successfully');
        navigate(redirectUrl);
      } else {
        await createWorkspace(values as Workspace);
        toast.success('Workspace created successfully');
        navigate(baseUrl);
      }
    } catch (e) {
      const error = e as Error;
      toast.error(error.message || 'Failed to save workspace');
    }
  };

  useEffect(() => {
    if (workspace) {
      form.reset(workspace);
    }
  }, [workspace, form]);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (workspaceLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!workspace && workspaceId) {
    return <Navigate to="/workspaces" />;
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white px-0 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-2xl md:max-w-3xl sm:bg-white sm:shadow-xl sm:rounded-2xl overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <header className="mb-8">
            <Breadcrumb className="mb-4 text-sm text-gray-500">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <a href="/workspaces">Workspaces</a>
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {workspaceId ? 'Edit' : 'Create'} Workspace
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {workspaceId ? 'Edit Workspace' : 'Create New Workspace'}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {workspaceId
                ? 'Update the workspace details below.'
                : 'Fill in the details to create a new workspace.'}
            </p>
          </header>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Workspace Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter workspace name" {...field} />
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
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter workspace description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
        <div className="mt-auto sm:mt-0 px-6 py-4 sm:bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate(redirectUrl)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            <Plus className="h-4 w-4 mr-2" />
            {workspaceId ? 'Update' : 'Create'} Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
