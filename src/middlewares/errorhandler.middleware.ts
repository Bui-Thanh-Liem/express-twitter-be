import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal Server Error'
  let details = {}

  if (err instanceof ZodError) {
    statusCode = 422
    message = 'Validation error'
    details = err.errors
  }

  res.status(statusCode).json({
    error: {
      message,
      details,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
  return // thêm return để đảm bảo trả về void
}
