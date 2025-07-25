import { Collection, Db, ObjectId } from 'mongodb'
import { ETweetAudience } from '~/shared/enums/common.enum'
import { ETweetType } from '~/shared/enums/type.enum'
import { IMedia } from '~/shared/interfaces/common/media.interface'
import { ITweet } from '~/shared/interfaces/schemas/tweet.interface'
import { BaseSchema } from './Base.schema'

export class TweetSchema extends BaseSchema implements ITweet {
  user_id: ObjectId
  type: ETweetType
  audience: ETweetAudience
  content: string
  parent_id: ObjectId | null
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: IMedia[]
  guest_view: number
  user_view: number

  constructor(tweet: Partial<ITweet>) {
    super()
    this.user_id = tweet.user_id || new ObjectId()
    this.type = tweet.type || ETweetType.Tweet
    this.audience = tweet.audience || ETweetAudience.TwitterCircle
    this.content = tweet.content || ''
    this.parent_id = tweet.parent_id || null
    this.hashtags = tweet.hashtags || []
    this.mentions = tweet.mentions || []
    this.medias = tweet.medias || []
    this.guest_view = tweet.guest_view || 0
    this.user_view = tweet.user_view || 0
  }
}

export let TweetCollection: Collection<TweetSchema>

export function initTweetCollection(db: Db) {
  TweetCollection = db.collection<TweetSchema>('tweets')
}
