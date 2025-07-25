import { ObjectId } from 'mongodb'
import { HashtagCollection, HashtagSchema } from '~/models/schemas/Hashtag.schema'

class HashtagsService {
  async checkHashtags(names: string[] | undefined) {
    if (!names || names.length === 0) return []
    const results = await Promise.all(
      names.map((name) => {
        return HashtagCollection.findOneAndUpdate(
          { name },
          { $setOnInsert: new HashtagSchema({ name }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )

    return results.map((result) => result?._id).filter(Boolean) as ObjectId[]
  }
}

export default new HashtagsService()
