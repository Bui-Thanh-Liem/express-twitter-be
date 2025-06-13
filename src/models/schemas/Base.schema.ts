import { ObjectId } from 'mongodb'

export abstract class BaseSchema {
  _id?: ObjectId
  created_at?: Date
  updated_at?: Date

  constructor() {
    this._id = undefined
    this.created_at = new Date()
    this.updated_at = new Date()
  }
}
