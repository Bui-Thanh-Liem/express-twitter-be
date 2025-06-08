import { ETweetType } from '~/shared/enums/type.enum'
import { IBase } from './base.interface'
import { ETweetAudience } from '~/shared/enums/common.enum'
import { IMedia } from '../common/media.interface'

export interface ITweet extends IBase {
  user_id: string
  type: ETweetType
  audience: ETweetAudience
  content: string
  parent_id: null | string // null khi là tweet gốc
  hashtags: string[]
  mentions: string[]
  medias: IMedia[]
  guest_view: number
  user_view: number
}
