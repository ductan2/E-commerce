import { ObjectId } from "mongodb"
import { orderProduct } from "./order.models"



export interface CartType {
  _id?: ObjectId
  products: orderProduct[]
  cartTotal: number
  totalAfterDiscount?: number
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
}
export class Carts {
  _id?: ObjectId
  products: orderProduct[]
  cartTotal: number
  totalAfterDiscount?: number
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
  constructor(cart: CartType) {
    this._id = cart._id || new ObjectId()
    this.products = cart.products || []
    this.cartTotal = cart.cartTotal || 0
    this.totalAfterDiscount = cart.totalAfterDiscount 
    this.orderby = cart.orderby || ""
    this.created_at = cart.created_at || new Date()
    this.updated_at = cart.updated_at || new Date()
  }
}