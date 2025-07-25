import { ObjectId } from 'mongodb'
import { CreateTweetDto } from '~/dtos/requests/tweet.dto'
import { TweetCollection, TweetSchema } from '~/models/schemas/Tweet.schema'
import HashtagsService from './Hashtags.service'

class TweetsService {
  async create(user_id: string, payload: CreateTweetDto) {
    const hashtags = await HashtagsService.checkHashtags(payload.hashtags)

    const result = await TweetCollection.insertOne(
      new TweetSchema({
        user_id: new ObjectId(user_id),
        type: payload.type,
        audience: payload.audience,
        hashtags: hashtags,
        content: payload.content,
        parent_id: new ObjectId(payload.parent_id),
        mentions: payload.mentions ? payload.mentions?.map((id) => new ObjectId(id)) : [],
        medias: payload.medias
      })
    )
    return result
  }
}

export default new TweetsService()
