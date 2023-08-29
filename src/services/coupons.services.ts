import Coupons, { CouponType } from "~/models/coupons.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";

class CouponsServices {
  async createCoupon(payload: CouponType) {
    return await databaseServices.coupons.insertOne(new Coupons({
      ...payload,
      name: payload.name.toUpperCase(),
      expire_date: new Date(payload.expire_date),
      discount: Number(payload.discount),
    }))
  }
  async getAllCoupons() {
    return await databaseServices.coupons.find().toArray()
  }
  async updateCoupon(id: string, payload: CouponType) {
    return await databaseServices.coupons.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...payload, updated_at: new Date() } }, { returnDocument: "after" })
  }
  async deleteCoupon(id: string) {
    return await databaseServices.coupons.deleteOne({ _id: new ObjectId(id) })
  }
}

export const couponsServices = new CouponsServices()