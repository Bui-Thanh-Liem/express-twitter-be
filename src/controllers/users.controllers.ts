import { Request, Response } from 'express'

export function usersController(req: Request, res: Response) {
  const { page, limit } = req.body
  console.log('page:::', page)
  console.log('limit:::', limit)

  res.status(200).json({ message: 'users route' })
}
