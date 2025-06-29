import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { envs } from '~/configs/env.config'
import { ChangePasswordDto, ToggleFollowDto } from '~/dtos/requests/User.dto'
import { UserCollection } from '~/models/schemas/User.schema'
import UsersService from '~/services/User.service'
import { CreatedResponse, OkResponse } from '~/shared/classes/response.class'
import { EUserVerifyStatus } from '~/shared/enums/status.enum'
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

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    const { code } = req.query
    const { access_token, refresh_token, status } = await UsersService.googleLogin(code as string)
    const url = `${envs.CLIENT_DOMAIN}/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}&s=${status}`
    res.redirect(url)
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const result = await UsersService.logout(refresh_token)
    res.json(new OkResponse('Logout Success', result))
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const result = await UsersService.forgotPassword(req.body)
    res.json(new OkResponse('Forgot password Success', result))
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const result = await UsersService.resetPassword(req?.user?._id as ObjectId, req.body)
    res.json(new OkResponse('Reset password Success', result))
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersService.verifyEmail(user_id)
    res.json(new OkResponse('Verify email Success', result))
  }

  async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload

    const user = await UserCollection.findOne({ _id: new ObjectId(user_id) })
    if (user?.verify === EUserVerifyStatus.Verified) {
      res.json(new OkResponse('Your email verified', true))
      return
    }

    const result = await UsersService.resendVerifyEmail(user_id)
    res.json(new OkResponse('Resend verify email Success', result))
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersService.getMe(user_id)
    res.json(new OkResponse('Get Me Success', result))
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersService.updateMe(user_id, req.body)
    res.json(new OkResponse('Update me Success', result))
  }

  async toggleFollow(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const { followed_user_id } = req.params as ToggleFollowDto
    const result = await UsersService.toggleFollow(user_id, followed_user_id)
    res.json(new OkResponse(`${result} Success`, true))
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const { new_password } = req.body as ChangePasswordDto
    const result = await UsersService.changePassword(user_id, new_password)
    res.json(new OkResponse(`Change password Success`, result))
  }
}

export default new UsersController()
