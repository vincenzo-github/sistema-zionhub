import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  church_id: z.string().uuid('Invalid church ID').optional(),
});

export const registerSchema = z.object({
  church_id: z.string().uuid('Invalid church ID'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
});

export const setupResponsibleSchema = z.object({
  setup_token: z.string(),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
});

export const activateAccountSchema = z.object({
  activation_token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const refreshTokenSchema = z.object({
  token: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
  church_id: z.string().uuid('Invalid church ID'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SetupResponsibleInput = z.infer<typeof setupResponsibleSchema>;
export type ActivateAccountInput = z.infer<typeof activateAccountSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;