import { NextFunction, Request, Response } from 'express'

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const now = new Date()
  console.log(`[${now.toISOString()}] ${req.method} ${req.url}`)
  next()
}
