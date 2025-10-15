import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '@/constants/issue';
import { z } from 'zod';
import { projectSchema } from './project';

export const issueSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, 'Issue title is required')
    .max(60, 'Issue title must be 60 characters or less'),
  description: z
    .string()
    .max(255, 'Description must be 255 characters or less')
    .optional(),
  priority: z.enum(ISSUE_PRIORITIES),
  status: z.enum(ISSUE_STATUSES),
  project: projectSchema.optional(),
});

export const createIssueSchema = issueSchema
  .omit({ id: true, project: true })
  .extend({
    projectId: z.number().optional(),
  });
export const editIssueSchema = issueSchema.omit({ project: true }).extend({
  projectId: z.number().optional(),
});

export const issuesResponseSchema = z.record(
  z.enum(ISSUE_STATUSES),
  z.array(issueSchema)
);

export type IssuesResponse = z.infer<typeof issuesResponseSchema>;
export type Issue = z.infer<typeof issueSchema>;
export type IssueCreate = z.infer<typeof createIssueSchema>;
export type IssueEdit = z.infer<typeof editIssueSchema>;
