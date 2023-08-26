import { ObjectId } from "mongodb"
import { BrandType } from "~/constants/enum"



export interface ProductType {
  _id?: ObjectId
  title?: string
  slug?: string
  description?: string
  price?: number
  brand?: BrandType
  category?: any[] // category 
  quantity?: number
  sold?: number
  images?: string[]
  color?: string[]
  ratings?: any[]
  craeted_at?: Date
  updated_at?: Date
}
export default class Products {
  _id?: ObjectId
  title?: string
  slug?: string
  description?: string
  price?: number
  brand?: BrandType
  category?: any[] // category 
  quantity?: number
  sold?: number
  images?: string[]
  color?: string[]
  ratings?: any[]
  craeted_at?: Date
  updated_at?: Date
  constructor(product: ProductType) {
    const date = new Date();
    this._id = product._id || new ObjectId()
    this.title = product.title || ""
    this.slug = product.slug || ""
    this.description = product.description || ""
    this.price = product.price || 0
    this.brand = product.brand || BrandType.NO_BRAND
    this.category = product.category || []
    this.quantity = product.quantity || 0
    this.images = product.images || []
    this.sold = product.sold || 0
    this.color = product.color || []
    this.ratings = product.ratings || []
    this.craeted_at = product.craeted_at || date
    this.updated_at = product.updated_at || date
  }
}