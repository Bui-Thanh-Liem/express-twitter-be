import { ObjectId } from 'mongodb'
import { StringValue } from 'ms'
import { envs } from '~/configs/env.config'
import { LoginUserDto, RegisterUserDto } from '~/dtos/requests/User.dto'
import { emailQueue } from '~/libs/bull/queues'
import { RefreshTokenCollection, RefreshTokenSchema } from '~/models/schemas/RefreshToken.schema'
import { UserCollection, UserSchema } from '~/models/schemas/User.schema'
import { ConflictError, NotFoundError, UnauthorizedError } from '~/shared/classes/error.class'
import { EUserVerifyStatus } from '~/shared/enums/status.enum'
import { TokenType } from '~/shared/enums/type.enum'
import { IJwtPayload } from '~/shared/interfaces/common/jwt.interface'
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
    const email_verify_token = await signToken({
      payload: { user_id: '', type: TokenType.verifyToken },
      privateKey: envs.JWT_SECRET_TEMP,
      options: { expiresIn: envs.ACCESS_TOKEN_EXPIRES_IN as StringValue }
    })

    //
    const result = await UserCollection.insertOne(
      new UserSchema({
        ...payload,
        password: passwordHashed,
        day_of_birth: new Date(payload.day_of_birth),
        email_verify_token
      })
    )

    // Khi đăng kí thành công thì cho người dùng đăng nhập luôn
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: result.insertedId.toString()
    })
    await RefreshTokenCollection.insertOne(new RefreshTokenSchema({ token: refresh_token, user_id: result.insertedId }))

    //
    await emailQueue.add({
      toEmail: payload.email,
      name: payload.name,
      url: `${envs.CLIENT_DOMAIN}/verify?token=${email_verify_token}`
    })

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

  async verifyEmail(user_id: string, token: string) {
    //
    const user = await UserCollection.findOne({ _id: new ObjectId(user_id), email_verify_token: token })
    if (!user) {
      throw new NotFoundError('Verify fail')
    }

    //
    return await UserCollection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          verify: EUserVerifyStatus.Verified
        }
      }
    )
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
