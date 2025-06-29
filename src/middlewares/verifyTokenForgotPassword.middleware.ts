import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { envs } from '~/configs/env.config'
import { UserCollection } from '~/models/schemas/User.schema'
import { UnauthorizedError } from '~/shared/classes/error.class'
import { verifyToken } from '~/utils/jwt.util'

export async function verifyTokenForgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.body?.forgot_password_token || undefined
    if (!token) {
      throw new UnauthorizedError('Token is required')
    }

    //
    const decoded = await verifyToken({ token, privateKey: envs.JWT_SECRET_TEMP })
    const user = await UserCollection.findOne({ _id: new ObjectId(decoded.user_id), forgot_password_token: token })
    if (!user) {
      throw new UnauthorizedError('Invalid password token')
    }

    req.user = user
    next()
  } catch (error) {
    next(new UnauthorizedError(error as string))
  }
}
