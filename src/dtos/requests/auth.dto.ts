import { z } from 'zod'
import { CONSTANT_REGEX } from '~/constants'

export const RegisterUserDtoSchema = z
  .object({
    name: z.string().min(1).max(20).trim(),
    email: z.string().email().trim(),
    password: z
      .string()
      .regex(CONSTANT_REGEX.STRONG_PASSWORD, {
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
      .trim(),
    confirm_password: z.string().trim(),
    day_of_birth: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg)
      }
      return arg
    }, z.date())
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match'
  })

export const LoginUserDtoSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().trim()
})

export const logoutUserDtoSchema = z.object({
  refresh_token: z.string().trim(),
  password: z.string().trim()
})

export const verifyEmailDtoSchema = z.object({
  email_verify_token: z.string().trim()
})

export const UpdateMeDtoSchema = z.object({
  name: z.string().min(1).max(20).trim().optional(),
  day_of_birth: z
    .preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg)
      }
      return arg
    }, z.date())
    .optional(),
  bio: z.string().min(1).max(200).trim().optional(),
  location: z.string().min(1).max(200).trim().optional(),
  website: z.string().min(1).max(100).trim().optional(),
  username: z.string().min(1).max(50).trim().regex(CONSTANT_REGEX.USERNAME, { message: 'Invalid username' }).optional(),
  avatar: z.string().min(1).max(400).trim().optional(),
  cover_photo: z.string().min(1).max(400).trim().optional()
})

export const ForgotPasswordDtoSchema = z.object({
  email: z.string().email().trim()
})

export const ResetPasswordDtoSchema = z
  .object({
    password: z.string().trim(),
    confirm_password: z.string().trim(),
    forgot_password_token: z.string().trim()
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Password do not match'
  })

export const toggleFollowDtoSchema = z.object({
  followed_user_id: z.string().trim().regex(CONSTANT_REGEX.ID_MONGO, {
    message: 'Invalid MongoDB ObjectId'
  })
})

export const ChangePasswordDtoSchema = z
  .object({
    old_password: z.string().trim(),
    new_password: z.string().trim(),
    confirm_new_password: z.string().trim()
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    path: ['confirm_password'],
    message: 'New password do not match'
  })

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>
export type LoginUserDto = z.infer<typeof RegisterUserDtoSchema>
export type UpdateMeDto = z.infer<typeof UpdateMeDtoSchema>
export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>
export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>
export type ToggleFollowDto = z.infer<typeof toggleFollowDtoSchema>
export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>
