import { NextFunction, Request, Response } from 'express'
import { envs } from '~/configs/env.config'
import { UnauthorizedError } from '~/shared/classes/error.class'
import { verifyToken } from '~/utils/jwt.util'

export async function verifyTempToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.body?.token || undefined

    if (!token) {
      throw new UnauthorizedError('Token is required')
    }

    //
    await verifyToken({ token, privateKey: envs.JWT_SECRET_TEMP })

    next()
  } catch (error) {
    next(new UnauthorizedError(error as string))
  }
}
