import { Collection, Db, ObjectId } from 'mongodb'
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

export let RefreshTokenCollection: Collection<RefreshTokenSchema>

export function initRefreshTokenCollection(db: Db) {
  RefreshTokenCollection = db.collection<RefreshTokenSchema>('refresh_tokens')
}
