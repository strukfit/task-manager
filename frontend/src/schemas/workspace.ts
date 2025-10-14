import { z } from 'zod';

export const workspaceSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(60, 'Workspace name must be 60 characters or less'),
  description: z
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional(),
});

export const createWorkspaceSchema = workspaceSchema.omit({ id: true });
export const editWorkspaceSchema = workspaceSchema;

export const workspacesResponseSchema = z.array(workspaceSchema);

export type WorkspacesResponse = z.infer<typeof workspacesResponseSchema>;
export type Workspace = z.infer<typeof workspaceSchema>;
export type WorkspaceCreate = z.infer<typeof createWorkspaceSchema>;
export type WorkspaceEdit = z.infer<typeof editWorkspaceSchema>;
