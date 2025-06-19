import { NextFunction, Request, Response } from 'express'
import UsersService from '~/services/User.service'
import { CreatedResponse, OkResponse } from '~/shared/classes/response.class'
import { IJwtPayload } from '~/shared/interfaces/common/jwt.interface'

class UsersController {
  async register(req: Request, res: Response) {
    const result = await UsersService.register(req.body)
    res.status(201).json(new CreatedResponse('Register Success', result))
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersService.login(req.body)
      res.json(new OkResponse('Login Success', result))
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const result = await UsersService.logout(refresh_token)
    res.json(new OkResponse('Logout Success', result))
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersService.verifyEmail(user_id, token)
    res.json(new OkResponse('Get Me Success', result))
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersService.getMe(user_id)
    res.json(new OkResponse('Get Me Success', result))
  }
}

export default new UsersController()
