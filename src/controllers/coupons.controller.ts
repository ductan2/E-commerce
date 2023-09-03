import { Request, Response } from "express"
import { couponsServices } from "~/services/coupons.services"


export const createCouponController = async (req: Request, res: Response) => {
  try {
    const { name, expire_date, discount } = req.body
    const result = await couponsServices.createCoupon({ name, expire_date, discount })
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Create coupon failed", status: 400 })
  }
}
export const getAllCouponsController = async (req: Request, res: Response) => {
  try {
    const result = await couponsServices.getAllCoupons()
    return res.status(200).json({
      message: "Get all coupons successfully",
      status: 200,
      result
    })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get all coupons failed", status: 400 })
  }
}
export const updateCouponController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { value } = await couponsServices.updateCoupon(id, req.body)
    return res.status(200).json({
      message: "Update coupon successfully",
      status: 200,
      result: value
    })
  } catch (error: any) {
    return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 })
  }
}
export const deleteCouponController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await couponsServices.deleteCoupon(id)
    return res.status(200).json({
      message: "Delete coupon successfully",
      status: 200,
      result
    })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Delete coupon failed", status: 400 })
  }
}