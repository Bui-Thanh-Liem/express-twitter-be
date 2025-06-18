import { ObjectId } from 'mongodb'
import { IBase } from '~/shared/interfaces/schemas/base.interface'

export abstract class BaseSchema implements IBase {
  _id?: ObjectId
  created_at?: Date
  updated_at?: Date

  constructor() {
    this._id = undefined
    this.created_at = new Date()
    this.updated_at = new Date()
  }
}
