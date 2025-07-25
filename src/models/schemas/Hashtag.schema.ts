import { Collection, Db } from 'mongodb'
import { IHashtag } from '~/shared/interfaces/schemas/hashtag.interface'
import { IVideo } from '~/shared/interfaces/schemas/video.interface'
import { BaseSchema } from './Base.schema'

export class HashtagSchema extends BaseSchema implements IHashtag {
  name: string

  constructor(video: Partial<IVideo>) {
    super()
    this.name = video.name || ''
  }
}

export let HashtagCollection: Collection<HashtagSchema>

export function initHashtagCollection(db: Db) {
  HashtagCollection = db.collection<HashtagSchema>('hashtags')
}
