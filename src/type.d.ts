import 'express'
import { IJwtPayload } from './shared/interfaces/common/jwt.interface'
import { IUser } from './shared/interfaces/schemas/user.interface'

declare module 'express' {
  interface Request {
    user?: IUser
    decoded_authorization?: IJwtPayload
    decoded_refresh_token?: IJwtPayload
  }
}
