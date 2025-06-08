import { IBase } from './base.interface'

export interface IFollower extends IBase {
  user_id: string
  followed_user_id: string
}
