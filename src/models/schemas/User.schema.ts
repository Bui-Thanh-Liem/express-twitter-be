import { Collection } from 'mongodb'
import database from '~/configs/database.config'
import { EUserVerifyStatus } from '~/shared/enums/status.enum'
import { IUser } from '~/shared/interfaces/schemas/user.interface'
import { BaseSchema } from './Base.schema'

export class UserSchema extends BaseSchema {
  name: string
  email: string
  password: string
  day_of_birth: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: EUserVerifyStatus
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string

  constructor(user: Partial<IUser>) {
    super()
    this.name = user.name || ''
    this.email = user.email || ''
    this.password = user.password || ''
    this.day_of_birth = user.day_of_birth || new Date()
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || EUserVerifyStatus.Unverified
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}

export const UserCollection = database.getDb().collection('users') as Collection<UserSchema>
