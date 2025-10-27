import z from 'zod';

export const passwordSchema = z.string().superRefine((password, ctx) => {
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
