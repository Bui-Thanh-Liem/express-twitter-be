import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function requestParamsValidate(schema: z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params)
      next()
    } catch (error) {
      next(error)
    }
  }
}
