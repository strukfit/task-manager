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
});
