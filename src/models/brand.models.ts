import { ObjectId } from "mongodb"
import { UploadImageType } from "~/constants/type"

export interface BrandType {
  _id?: ObjectId
  title: string
  images: UploadImageType | string
  quantity: number
  created_at?: Date
  updated_at?: Date
}
export default class Brands {
  _id?: ObjectId
  title: string
  images: UploadImageType | string
  quantity: number

  created_at?: Date
  updated_at?: Date
  constructor(brand: BrandType) {
    this._id = brand._id || new ObjectId
    this.title = brand.title
    this.images = brand.images || "https://www.wfmalaysia.com/image/wfmalaysia/image/data/Screenshot%202020-07-05%20at%206.34.45%20PM.png"
    this.quantity = brand.quantity || 0
    this.created_at = brand.created_at || new Date()
    this.updated_at = brand.updated_at || new Date()
  }
}