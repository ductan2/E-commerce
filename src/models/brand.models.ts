import { ObjectId } from "mongodb"

export interface BrandType {
  _id?: ObjectId
  title: string
  created_at?: Date
  updated_at?: Date
}
export default class Brands {
  _id?: ObjectId
  title: string
  created_at?: Date
  updated_at?: Date
  constructor(brand: BrandType) {
    this._id = brand._id || new ObjectId
    this.title = brand.title
    this.created_at = brand.created_at || new Date()
    this.updated_at = brand.updated_at || new Date()
  }
}