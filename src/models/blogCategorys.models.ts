import { ObjectId } from "mongodb"

export interface BlogCategpryType {
  _id?: ObjectId
  title: string
  created_at?: Date
  updated_at?: Date
}
export default class BlogCategorys {
  _id?: ObjectId
  title: string
  created_at?: Date
  updated_at?: Date
  constructor(cate: BlogCategpryType) {
    this._id = cate._id || new ObjectId
    this.title = cate.title
    this.created_at = cate.created_at || new Date()
    this.updated_at = cate.updated_at || new Date()
  }
}