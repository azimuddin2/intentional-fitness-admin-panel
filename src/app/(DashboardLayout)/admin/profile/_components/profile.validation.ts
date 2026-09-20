import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),

    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'New Password must be at least 8 characters')
      .regex(/[a-z]/, 'New Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'New Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'New Password must contain at least one number')
      .regex(
        /[!@#$%^&*]/,
        'New Password must contain at least one special character',
      ),

    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type TChangePassword = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
});

export type TUpdateProfile = z.infer<typeof updateProfileSchema>;
