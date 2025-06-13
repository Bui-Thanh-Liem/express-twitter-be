import { LoginUserDto, RegisterUserDto } from '~/dtos/User.dto'
import { UserCollection, UserSchema } from '~/models/schemas/User.schema'
import { hashPassword, verifyPassword } from '~/utils/crypto.util'

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
    if (exist) {
      throw Error('Email does not exist')
    }

    //
    const verifyPass = verifyPassword(payload.password, exist.)
  }

  async findOneByEmail(email: string) {
    return await UserCollection.findOne({ email })
  }
}

export default new UsersService()
