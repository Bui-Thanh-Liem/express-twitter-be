import { StringValue } from 'ms'
import { envs } from '~/configs/env.config'
import { LoginUserDto, RegisterUserDto } from '~/dtos/User.dto'
import { UserCollection, UserSchema } from '~/models/schemas/User.schema'
import { TokenType } from '~/shared/enums/type.enum'
import { hashPassword, verifyPassword } from '~/utils/crypto.util'
import { signToken } from '~/utils/jwt.util'

class UsersService {
  async register(payload: RegisterUserDto) {
    //
    const existEmail = await this.findOneByEmail(payload.email)
    if (existEmail) {
      throw Error('Email already exists')
    }

    //
    const passwordHashed = hashPassword(payload.password)

    //
    const result = await UserCollection.insertOne(
      new UserSchema({ ...payload, password: passwordHashed, day_of_birth: new Date(payload.day_of_birth) })
    )
    return result
  }

  async login(payload: LoginUserDto) {
    //
    const exist = await this.findOneByEmail(payload.email)
    if (!exist) {
      throw Error('Email does not exist')
    }

    //
    const verifyPass = verifyPassword(payload.password, exist.password)
    if (!verifyPass) {
      throw Error('Password not correct')
    }

    //
    const [access_token, refresh_token] = await Promise.all([
      signToken({
        payload: { user_id: exist._id, type: TokenType.accessToken },
        options: { algorithm: 'HS256', expiresIn: envs.ACCESS_TOKEN_EXPIRES_IN as StringValue }
      }),
      signToken({
        payload: { user_id: exist._id, type: TokenType.refreshToken },
        options: { algorithm: 'HS256', expiresIn: envs.REFRESH_TOKEN_EXPIRES_IN as StringValue }
      })
    ])

    const { password, ...rest } = exist
    return {
      ...rest,
      access_token,
      refresh_token
    }
  }

  async findOneByEmail(email: string) {
    return await UserCollection.findOne({ email })
  }
}

export default new UsersService()
