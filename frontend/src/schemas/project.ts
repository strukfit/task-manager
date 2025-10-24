import z from 'zod';

export const projectSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(60, 'Project name must be 60 characters or less'),
  description: z
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional(),
  createdAt: z.string(),
});

export const createProjectSchema = projectSchema.omit({ id: true });
export const editProjectSchema = projectSchema;

export const projectsResponseSchema = z.array(projectSchema);

export type ProjectsResponse = z.infer<typeof projectsResponseSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectCreate = z.infer<typeof createProjectSchema>;
export type ProjectEdit = z.infer<typeof editProjectSchema>;
