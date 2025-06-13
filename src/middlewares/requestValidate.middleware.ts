import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export const requestValidate = (schema: z.ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
