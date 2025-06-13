import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation error',
        details: err.errors
      }
    })
    return // thêm return để kết thúc, nhưng trả về void
  }

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
  return // thêm return để đảm bảo trả về void
}
