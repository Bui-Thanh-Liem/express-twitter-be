import { NextFunction, Request, Response } from 'express'
import UsersService from '~/services/User.service'
import { CreatedResponse } from '~/shared/classes/response.class'

class UsersController {
  async register(req: Request, res: Response) {
    const result = await UsersService.register(req.body)
    res.json(new CreatedResponse('Register Success', result))
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersService.login(req.body)
      res.json({ message: 'Login Success', data: result })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const result = await UsersService.logout(refresh_token)
    res.status(200).json(new CreatedResponse('Logout Success', result))
  }
}

export default new UsersController()
