import { Collection, Db, ObjectId } from 'mongodb'
import { EVideoStatus } from '~/shared/enums/status.enum'
import { IVideo } from '~/shared/interfaces/schemas/video.interface'
import { BaseSchema } from './Base.schema'

export class VideoSchema extends BaseSchema implements IVideo {
  user_id: ObjectId
  name: string
  size: number
  status: EVideoStatus

  constructor(video: Partial<IVideo>) {
    super()
    this.name = video.name || ''
    this.size = video.size || 0
    this.user_id = video.user_id || new ObjectId()
    this.status = video.status || EVideoStatus.Pending
  }
}

export let VideoCollection: Collection<VideoSchema>

export function initVideoCollection(db: Db) {
  VideoCollection = db.collection<VideoSchema>('videos')
}
