import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { envs } from '~/configs/env.config'
import { ChangePasswordDto, ToggleFollowDto } from '~/dtos/requests/User.dto'
import { UserCollection } from '~/models/schemas/User.schema'
import UsersServices from '~/services/User.service'
import { CreatedResponse, OkResponse } from '~/shared/classes/response.class'
import { EUserVerifyStatus } from '~/shared/enums/status.enum'
import { IJwtPayload } from '~/shared/interfaces/common/jwt.interface'

class UsersController {
  async register(req: Request, res: Response) {
    const result = await UsersServices.register(req.body)
    res.status(201).json(new CreatedResponse('Register Success', result))
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersServices.login(req.body)
      res.json(new OkResponse('Login Success', result))
    } catch (error) {
      next(error)
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    const { code } = req.query
    const { access_token, refresh_token, status } = await UsersServices.googleLogin(code as string)
    const url = `${envs.CLIENT_DOMAIN}/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}&s=${status}`
    res.redirect(url)
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const result = await UsersServices.logout(refresh_token)
    res.json(new OkResponse('Logout Success', result))
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body
    const { user_id, exp } = req.decoded_refresh_token as IJwtPayload
    const result = await UsersServices.refreshToken({ user_id, token: refresh_token, exp })
    res.json(new OkResponse('Refresh token Success', result))
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const result = await UsersServices.forgotPassword(req.body)
    res.json(new OkResponse('Forgot password Success', result))
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const result = await UsersServices.resetPassword(req?.user?._id as ObjectId, req.body)
    res.json(new OkResponse('Reset password Success', result))
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersServices.verifyEmail(user_id)
    res.json(new OkResponse('Verify email Success', result))
  }

  async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload

    const user = await UserCollection.findOne({ _id: new ObjectId(user_id) })
    if (user?.verify === EUserVerifyStatus.Verified) {
      res.json(new OkResponse('Your email verified', true))
      return
    }

    const result = await UsersServices.resendVerifyEmail(user_id)
    res.json(new OkResponse('Resend verify email Success', result))
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersServices.getMe(user_id)
    res.json(new OkResponse('Get Me Success', result))
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const result = await UsersServices.updateMe(user_id, req.body)
    res.json(new OkResponse('Update me Success', result))
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const { new_password } = req.body as ChangePasswordDto
    const result = await UsersServices.changePassword(user_id, new_password)
    res.json(new OkResponse(`Change password Success`, result))
  }

  // Feature
  async toggleFollow(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as IJwtPayload
    const { followed_user_id } = req.params as ToggleFollowDto
    const result = await UsersServices.toggleFollow(user_id, followed_user_id)
    res.json(new OkResponse(`${result} Success`, true))
  }
}

export default new UsersController()
