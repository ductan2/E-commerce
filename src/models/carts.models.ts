import { ObjectId } from "mongodb"


export interface cartProduct {
  product: string
  color: string
  count: number
  price: number
}
export interface CartType {
  _id?: ObjectId
  products: cartProduct[]
  cartTotal: number
  totalAfterDiscount?: number
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
}
export class Carts {
  _id?: ObjectId
  products: cartProduct[]
  cartTotal: number
  totalAfterDiscount?: number
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
  constructor(cart: CartType) {
    this._id = cart._id || new ObjectId()
    this.products = cart.products || []
    this.cartTotal = cart.cartTotal || 0
    this.totalAfterDiscount = cart.totalAfterDiscount || this.cartTotal
    this.orderby = cart.orderby || ""
    this.created_at = cart.created_at || new Date()
    this.updated_at = cart.updated_at || new Date()
  }
}