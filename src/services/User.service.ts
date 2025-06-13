import { RegisterUserDto } from '~/dtos/User.dto'
import { UserCollection, UserSchema } from '~/models/schemas/User.schema'

class UsersService {
  async register(payload: RegisterUserDto) {
    const result = await UserCollection.insertOne(new UserSchema(payload))
    return result
  }
}

export default new UsersService()
