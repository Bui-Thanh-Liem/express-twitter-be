import { NextFunction, Request, Response } from 'express'
import UsersService from '~/services/User.service'

class UsersController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersService.register(req.body)
      res.json({ message: 'ok', data: result })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    
  }
}

export default new UsersController()
