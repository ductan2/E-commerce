import { checkSchema } from "express-validator";
import databaseServices from "~/services/database.services";


export const CouponsValidator = checkSchema({
  name: {
    notEmpty: true,
    trim: true,
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      }
    },
    custom: {
      options: async (value: string) => {
        const nameCoupon = value.toUpperCase()
        const isExist = await databaseServices.coupons.findOne({ name: nameCoupon })
        if (isExist) throw new Error("Coupon is exist")
      }
    }
  },
  expire_date: {
    notEmpty: true,
    trim: true,
  },
  discount: {
    notEmpty: true,
    trim: true,
    isNumeric: true,// 2 options for this (0->100%) or (0->max$)
    errorMessage: "Discount must be a number"
  }
}, ["body"])
export const updateCouponsValidator = checkSchema({
  name: {
    optional: true,
    trim: true,
    isString: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      }
    },
    custom: {
      options: async (value: string) => {
        const nameCoupon = value.toUpperCase()
        const isExist = await databaseServices.coupons.findOne({ name: nameCoupon })
        if (isExist) throw new Error("Coupon is exist")
      }
    }
  },
  expire_date: {
    optional: true,
    trim: true,
  },
  discount: {
    optional: true,
    trim: true,
    isNumeric: true,// 2 options for this (0->100%) or (0->max$)
    errorMessage: "Discount must be a number"
  }
}, ["body"])