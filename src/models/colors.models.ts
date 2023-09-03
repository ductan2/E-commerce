import { ObjectId } from "mongodb"


export interface ColorType {
  _id?:ObjectId
  title: string
  created_at?:Date
  updated_at?:Date
}
export class Colors {
  _id?:ObjectId
  title: string
  created_at?:Date
  updated_at?:Date
  constructor(color:ColorType){
    this._id = color._id || new ObjectId()
    this.title = color.title
    this.created_at = color.created_at || new Date()
    this.updated_at = color.updated_at || new Date()
  }
}