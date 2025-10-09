import { z } from 'zod';

const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
});

const taskResponseSchema = z.object({
  data: z.array(taskSchema),
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;
