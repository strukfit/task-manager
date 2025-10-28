import { z } from 'zod';
import { passwordSchema } from './common';

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export const editUserProfileSchema = userSchema.omit({ id: true });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: passwordSchema,
});

export type User = z.infer<typeof userSchema>;
export type EditProfileData = z.infer<typeof editUserProfileSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
