import { checkSchema } from "express-validator"
import { statusContact } from "~/constants/enum"
import databaseServices from "~/services/database.services"
import { EnumToArray } from "~/utils/commons"

const statusContactType = EnumToArray(statusContact)

export const contactSchema = checkSchema({
  name: {
    notEmpty: true,
    trim: true,
    isString: true,
    errorMessage: "Name is required"
  },
  email: {
    notEmpty: true,
    trim: true,
    isEmail: true,
    errorMessage: "Email is invalid",
    custom: {
      options: (async (value) => {
        const isExits = await databaseServices.users.findOne({ email: value })
        if (!isExits) throw new Error("Email does not exits!")
        return true;
      })
    }
  },
  phone: {
    notEmpty: true,
    trim: true,
  },
  message: {
    notEmpty: true,
    trim: true,
  },
  status: {
    optional: true,
    trim: true,
    isIn: {
      options: [statusContactType],
    },
  }
}, ["body"])
export const updateContactSchema = checkSchema({
  name: {
    optional: true,
    trim: true,
    isString: true,
    errorMessage: "Name is required"
  },
  email: {
    optional: true,
    trim: true,
    isEmail: true,
    errorMessage: "Email is invalid",
    custom: {
      options: (async (value) => {
        const isExits = await databaseServices.users.findOne({ email: value })
        if (!isExits) throw new Error("Email does not exits!")
        return true;
      })
    }
  },
  phone: {
    optional: true,
    trim: true,
  },
  message: {
    optional: true,
    trim: true,
  },
  status: {
    optional: true,
    trim: true,
    isIn: {
      options: [statusContactType],
    },
  }
}, ["body"])