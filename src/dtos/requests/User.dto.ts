import { z } from 'zod'

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
export const RegisterUserDtoSchema = z
  .object({
    name: z.string().min(1).max(20),
    email: z.string().email(),
    password: z.string().regex(strongPasswordRegex, {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
    confirm_password: z.string(),
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
  email: z.string().email(),
  password: z.string()
})

export const logoutUserDtoSchema = z.object({
  refresh_token: z.string(),
  password: z.string()
})

export const verifyEmailDtoSchema = z.object({
  token: z.string()
})

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>
export type LoginUserDto = z.infer<typeof RegisterUserDtoSchema>
