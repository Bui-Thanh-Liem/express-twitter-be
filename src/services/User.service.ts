import { StringValue } from 'ms'
import { envs } from '~/configs/env.config'
import { LoginUserDto, RegisterUserDto } from '~/dtos/requests/User.dto'
import { RefreshTokenCollection, RefreshTokenSchema } from '~/models/schemas/RefreshToken.schema'
import { UserCollection, UserSchema } from '~/models/schemas/User.schema'
import { ConflictError, UnauthorizedError } from '~/shared/classes/error.class'
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
    const result = await UserCollection.insertOne(
      new UserSchema({ ...payload, password: passwordHashed, day_of_birth: new Date(payload.day_of_birth) })
    )

    //
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: result.insertedId.toString()
    })

    //
    return {
      access_token,
      refresh_token
    }
  }

  async login(payload: LoginUserDto) {
    //
    const exist = await UserCollection.findOne(
      { email: payload.email },
      {
        projection: {
          email: 1,
          password: 1
        }
      }
    )
    if (!exist) {
      throw new UnauthorizedError('Email or password not correct')
    }
    console.log('exist:::', exist)

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
