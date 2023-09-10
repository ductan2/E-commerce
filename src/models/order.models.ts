import { ObjectId } from "mongodb"
import { statusOrder } from "~/constants/enum"

export interface orderProduct {
  product: ObjectId
  color: string
  count: number
  price?: number
}
type PaymentIntentType={
  id?: string
  method?:string
  amount?:number
  status?:statusOrder
  created?:Date
  currency?:string
}

export interface OrderType {
  _id?: ObjectId
  products: orderProduct[]
  payment_intent: PaymentIntentType
  order_status: statusOrder
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
}

export class Order {
  _id?: ObjectId
  products: orderProduct[]
  payment_intent: PaymentIntentType
  order_status: statusOrder
  orderby: string// ref user
  created_at?: Date
  updated_at?: Date
  constructor(order: OrderType) {
    this._id = order._id || new ObjectId()
    this.products = order.products || []
    this.payment_intent = order.payment_intent || {}
    this.order_status = order.order_status || statusOrder.NOT_PROCESSED
    this.orderby = order.orderby || ""
    this.created_at = order.created_at || new Date()
    this.updated_at = order.updated_at || new Date()
  }
}