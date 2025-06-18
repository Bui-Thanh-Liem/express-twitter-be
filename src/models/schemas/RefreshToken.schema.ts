import { Collection, ObjectId } from 'mongodb'
import database from '~/configs/database.config'
import { IRefresh } from '~/shared/interfaces/schemas/refresh.interface'
import { BaseSchema } from './Base.schema'

export class RefreshTokenSchema extends BaseSchema implements IRefresh {
  token: string
  user_id: ObjectId

  constructor(data: IRefresh) {
    super()
    this.token = data.token
    this.user_id = data.user_id
  }
}

export const RefreshTokenCollection = database.getDb().collection('refresh_tokens') as Collection<RefreshTokenSchema>
