import { ParamSchema, checkSchema } from "express-validator";
import { statusOrder } from "~/constants/enum";
import databaseServices from "~/services/database.services";
import { EnumToArray } from "~/utils/commons";
const statusOrdersType = EnumToArray(statusOrder)
const passwordSchema: ParamSchema = {
  notEmpty: true,
  isLength: {
    options: {
      min: 6,
      max: 25,
    }
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 0
    },
    errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
  }
}
const confirmPasswordSchema: ParamSchema = {
  notEmpty: true,
  isLength: {
    options: {
      min: 6,
      max: 25,
    }
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minUppercase: 1,
      minSymbols: 0
    },
    errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
  },
  custom: {
    options: ((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match password!")
      }
      return true;
    })
  }
}
export const RegisterValidator = checkSchema({
  firstname: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 25,
      },
      errorMessage: "First name must be at least 2 characters long and less than 25 characters long."
    },
  },
  lastname: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 25,
      },
      errorMessage: "Last name must be at least 2 characters long and less than 25 characters long."
    },
  },
  email: {
    notEmpty: true,
    isEmail: {
      errorMessage: "Email is invalid",
    },
    trim: true,
    custom: {
      options: (async (value) => {
        const isCheck = await databaseServices.users.findOne({ email: value })
        if (isCheck) {
          throw new Error("Email already exists!")
        }
      })
    }

  },
  mobile: {
    notEmpty: true,
    isMobilePhone: true,
    trim: true,
  },

  password: passwordSchema,
  confirmPassword: confirmPasswordSchema
}, ["body"])
export const LoginValidator = checkSchema({
  email: {
    notEmpty: true,
    isEmail: {
      errorMessage: "Email is invalid",
    },
    trim: true,
    custom: {
      options: (async (value) => {
        const isCheck = await databaseServices.users.findOne({ email: value })
        if (!isCheck) {
          throw new Error("Email does not exits!")
        }
      })
    }

  },
  password: passwordSchema,
}, ["body"])
export const UpdatePasswordValidator = checkSchema({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmNewPassword: {
    ...confirmPasswordSchema,
    custom: {
      options: ((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Confirm password does not match password!")
        }
        return true;
      })
    }
  }
}, ["body"])
export const UpdateValidator = checkSchema({
  firstname: {
    optional: true,
    isString: {
      errorMessage: "Bio must be string"
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 25,
      },
      errorMessage: "First name must be at least 2 characters long and less than 25 characters long."
    },
  },
  lastname: {
    optional: true,
    isString: {
      errorMessage: "Bio must be string"
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 25,
      },
      errorMessage: "Last name must be at least 2 characters long and less than 25 characters long."
    },
  },
  mobile: {
    optional: true,
    isMobilePhone: true,
    trim: true,
  },
}, ["body"])
export const ForgotPasswordValidator = checkSchema({
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema
}, ["body"])
export const StatusOrderValidator = checkSchema({
  status: {
    notEmpty: true,
    isString: {
      errorMessage: "Status must be string"
    },
    trim: true,
    isIn: {
      options: [statusOrdersType],
      errorMessage: `Status must be ${statusOrdersType.join(", ")}`
    }
  }
}, ["body"])

