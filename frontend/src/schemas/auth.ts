import { z } from 'zod';
import { userSchema } from './user';

const passwordSchema = z.string().superRefine((password, ctx) => {
  if (!password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required',
      path: ['password'],
    });
    return;
  }

  if (password.length < 8 || password.length > 128) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must be 8-128 characters',
      path: ['length'],
    });
  }

  if (!/[A-Z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one uppercase letter',
      path: ['uppercase'],
    });
  }

  if (!/[a-z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one lowercase letter',
      path: ['lowercase'],
    });
  }

  if (!/\d/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one digit',
      path: ['digit'],
    });
  }

  if (/\s/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must not contain whitespace',
      path: ['whitespace'],
    });
  }
});

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
  password: passwordSchema,
});

export const requestPasswordResetSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
});

export type AuthResponse = z.infer<typeof authSchema>;
export type LoginCreditentials = z.infer<typeof loginSchema>;
export type SignupCreditentials = z.infer<typeof signupSchema>;
export type RequestPasswordResetCreditentials = z.infer<
  typeof requestPasswordResetSchema
>;
export type ResetPasswordCreditentials = z.infer<typeof resetPasswordSchema>;
