import { z } from 'zod';
import { userSchema } from './user';

export const authSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const signupSchema = loginSchema.extend({
  email: z.email(),
});

export type AuthResponse = z.infer<typeof authSchema>;
export type LoginCreditentials = z.infer<typeof loginSchema>;
export type SignupCreditentials = z.infer<typeof signupSchema>;
