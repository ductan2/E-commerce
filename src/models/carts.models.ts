import { ObjectId } from "mongodb"



export interface CartType {
  _id?: ObjectId
  product: ObjectId
  cartTotal: number
  totalAfterDiscount: number
  amount:number
  color:ObjectId
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
}
export class Carts {
  _id?: ObjectId
  product: ObjectId
  cartTotal: number
  totalAfterDiscount: number
  amount:number
  color:ObjectId
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
  constructor(cart: CartType) {
    this._id = cart._id || new ObjectId()
    this.product = cart.product
    this.cartTotal = cart.cartTotal || 0
    this.amount = cart.amount || 0
    this.color = cart.color 
    this.totalAfterDiscount = cart.totalAfterDiscount 
    this.orderby = cart.orderby || ""
    this.created_at = cart.created_at || new Date()
    this.updated_at = cart.updated_at || new Date()
  }
}