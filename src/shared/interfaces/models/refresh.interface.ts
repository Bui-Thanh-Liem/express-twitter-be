import { IBase } from './base.interface'

export interface IRefresh extends IBase {
  token: string
  user_id: string
}
