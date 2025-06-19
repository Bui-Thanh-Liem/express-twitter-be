import { ObjectId } from 'mongodb'
import { StringValue } from 'ms'
import { envs } from '~/configs/env.config'
import { LoginUserDto, RegisterUserDto } from '~/dtos/requests/User.dto'
import cacheServiceInstance from '~/helpers/cache.helper'
import mailServiceInstance from '~/helpers/mail.helper'
import { emailQueue } from '~/libs/bull/queues'
import { RefreshTokenCollection, RefreshTokenSchema } from '~/models/schemas/RefreshToken.schema'
import { UserCollection, UserSchema } from '~/models/schemas/User.schema'
import { ConflictError, UnauthorizedError } from '~/shared/classes/error.class'
import { TokenType } from '~/shared/enums/type.enum'
import { IJwtPayload } from '~/shared/interfaces/common/jwt.interface'
import { createKeyVerifyEmail } from '~/utils/createKeyCache'
import { hashPassword, verifyPassword } from '~/utils/crypto.util'
import { signToken } from '~/utils/jwt.util'

class UsersService {
  async register(payload: RegisterUserDto) {
    //
    const existEmail = await this.findOneByEmail(payload.email)
    if (existEmail) {
      throw new ConflictError('Email already exists')
    }

    //
    const passwordHashed = hashPassword(payload.password)

    //
    const result = await UserCollection.insertOne(
      new UserSchema({ ...payload, password: passwordHashed, day_of_birth: new Date(payload.day_of_birth) })
    )

    // Khi đăng kí thành công thì cho người dùng đăng nhập luôn
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: result.insertedId.toString()
    })
    await RefreshTokenCollection.insertOne(new RefreshTokenSchema({ token: refresh_token, user_id: result.insertedId }))

    // Send email to verify (mặc định 10p để verify, nếu không phải resend lại email)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    const keyCache = createKeyVerifyEmail(payload.email)
    const isCached = await cacheServiceInstance.setCache(keyCache, verifyCode)

    if (isCached) {
      console.log('isCached:::', isCached)
      await emailQueue.add({ toEmail: payload.email, name: payload.name, verifyCode })
    }

    //
    return {
      access_token,
      refresh_token
    }
  }

  async login(payload: LoginUserDto) {
    //
    const exist = await this.findOneByEmail(payload?.email)
    if (!exist) {
      throw new UnauthorizedError('Email or password not correct')
    }

    //
    const verifyPass = verifyPassword(payload.password, exist.password)
    if (!verifyPass) {
      throw new UnauthorizedError('Email or password not correct')
    }

    //
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({ user_id: exist._id.toString() })
    await RefreshTokenCollection.insertOne(new RefreshTokenSchema({ token: refresh_token, user_id: exist._id }))

    return {
      token: {
        access_token,
        refresh_token
      }
    }
  }

  async logout(refresh_token: string) {
    return await RefreshTokenCollection.deleteOne({ token: refresh_token })
  }

  async getMe(id: string) {
    return await UserCollection.findOne(
      { _id: new ObjectId(id) },
      {
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 }
      }
    )
  }

  // For auth
  async findOneByEmail(email: string) {
    return await UserCollection.findOne(
      { email },
      {
        projection: {
          email: 1,
          password: 1
        }
      }
    )
  }

  //  For local
  async signAccessAndRefreshToken(payload: Pick<IJwtPayload, 'user_id'>): Promise<[string, string]> {
    return (await Promise.all([
      signToken({
        payload: { ...payload, type: TokenType.accessToken },
        privateKey: envs.JWT_SECRET_ACCESS,
        options: { expiresIn: envs.ACCESS_TOKEN_EXPIRES_IN as StringValue }
      }),
      signToken({
        payload: { ...payload, type: TokenType.refreshToken },
        privateKey: envs.JWT_SECRET_REFRESH,
        options: { expiresIn: envs.REFRESH_TOKEN_EXPIRES_IN as StringValue }
      })
    ])) as [string, string]
  }
}

export default new UsersService()
