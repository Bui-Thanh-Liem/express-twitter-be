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
    day_of_birth: z.string()
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match'
  })

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>
