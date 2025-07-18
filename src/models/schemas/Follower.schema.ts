import { Collection, ObjectId } from 'mongodb'
import database from '~/configs/database.config'
import { IFollower } from '~/shared/interfaces/schemas/follower.interface'
import { BaseSchema } from './Base.schema'

export class FollowerSchema extends BaseSchema implements IFollower {
  user_id: ObjectId
  followed_user_id: ObjectId

  constructor(follow: Partial<IFollower>) {
    super()
    this.user_id = follow.user_id || new ObjectId()
    this.followed_user_id = follow.followed_user_id || new ObjectId()
  }
}

export const FollowerCollection = database.getDb().collection('followers') as Collection<FollowerSchema>
