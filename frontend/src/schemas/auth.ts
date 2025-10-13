import { z } from 'zod';
import { userSchema } from './user';

export const authSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

export type AuthResponse = z.infer<typeof authSchema>;
