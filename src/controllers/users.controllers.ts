import { NextFunction, Request, Response } from 'express'
import UsersService from '~/services/User.service'

class UsersController {
  async register(req: Request, res: Response) {
    const result = await UsersService.register(req.body)
    res.json({ message: 'ok', data: result })
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersService.login(req.body)
      res.json({ message: 'ok', data: result })
    } catch (error) {
      next(error)
    }
  }
}

export default new UsersController()
