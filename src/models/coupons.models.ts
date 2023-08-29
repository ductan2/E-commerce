import { ObjectId } from "mongodb"

export interface CouponType {
  _id?: ObjectId
  name: string
  expire_date: Date
  discount: number
  created_at?: Date
  updated_at?: Date
}
export default class Coupons {
  _id?: ObjectId
  name: string
  expire_date: Date
  discount: number
  created_at?: Date
  updated_at?: Date

  constructor(coupon: CouponType) {
    this._id = coupon._id || new ObjectId
    this.name = coupon.name
    this.expire_date = coupon.expire_date
    this.discount= coupon.discount
    this.created_at = coupon.created_at || new Date
    this.updated_at = coupon.updated_at || new Date
  }
}