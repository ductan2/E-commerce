import { checkSchema } from "express-validator";
import { ObjectId } from "mongodb";
import { ErrorWithStatus } from "~/constants/type";
import databaseServices from "~/services/database.services";


export const ProductsValidator = checkSchema({
  title: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Title must be at least 2 characters long and less than 25 characters long."
    },
  },
  slug: {
    optional: true,
    trim: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Slug must be at least 2 characters long and less than 25 characters long."
    },
  },
  description: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 10000,
      },
      errorMessage: "Description must be at least 2 characters long and less than 25 characters long."
    },
  },
  price: {
    notEmpty: true,
    isNumeric: true,
    errorMessage: "Price must be a number"
  },
  category: {
    notEmpty: true,
    isArray: true,
    errorMessage: "Category must be an array objectId",
    custom: {
      options: async (value) => {
        const ids = value.map((item: string) => new ObjectId(item))
        const isProc = await databaseServices.productCategorys.find({ _id: { $in: ids } }).toArray()
        if (isProc.length !== value.length) throw new ErrorWithStatus({ message: "Category is not exist", status: 404 })
        return true;
      }
    }
  },
  brand: {
    optional: true,
    custom: {
      options: async (value) => {
        const isBrand = await databaseServices.brands.findOne({ _id: new ObjectId(value) })
        if (!isBrand) throw new ErrorWithStatus({ message: "Brand is not exist", status: 404 })
        return true;
      }
    }
  },
  quantity: {
    notEmpty: true,
    isNumeric: true,
  },
}, ["body"])
export const UpdateProductValidator = checkSchema({
  title: {
    trim: true,
    optional: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Title must be at least 2 characters long and less than 25 characters long."
    },
  },
  slug: {
    trim: true,
    optional: true,
    isLength: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Slug must be at least 2 characters long and less than 25 characters long."
    },
  },
  description: {
    trim: true,
    optional: true,
    isLength: {
      options: {
        min: 1,
        max: 10000,
      },
      errorMessage: "Description must be at least 2 characters long and less than 25 characters long."
    },
  },
  price: {
    isNumeric: true,
    optional: true,
    errorMessage: "Price must be a number"
  },
  category: {
    notEmpty: true,
    isArray: true,
    errorMessage: "Category must be an array objectId",
    custom: {
      options: async (value) => {
        const ids = value.map((item: string) => new ObjectId(item))
        const isProc = await databaseServices.productCategorys.find({ _id: { $in: ids } }).toArray()
        if (isProc.length !== value.length) throw new ErrorWithStatus({ message: "Category is not exist", status: 404 })
        return true;
      }
    }
  },
  brand: {
    optional: true,
    custom: {
      options: async (value) => {
        const isBrand = await databaseServices.brands.findOne({ _id: new ObjectId(value) })
        if (!isBrand) throw new ErrorWithStatus({ message: "Brand is not exist", status: 404 })
        return true;
      }
    }
  },
  quantity: {
    optional: true,
    isNumeric: true,
  },
}, ["body"])

export const WishListValidator = checkSchema({
  product_id: {
    notEmpty: true,
    trim: true,
    custom: {
      options: async (value) => {
        const isProc = await databaseServices.products.findOne({ _id: new ObjectId(value) })
        if (!isProc) throw new ErrorWithStatus({ message: "Product is not exist", status: 404 })
      }
    }
  },
}, ["body"])

export const RatingValidator = checkSchema({
  product_id: {
    notEmpty: true,
    trim: true,
    custom: {
      options: async (value) => {
        const isProc = await databaseServices.products.findOne({ _id: new ObjectId(value) })
        if (!isProc) throw new ErrorWithStatus({ message: "Product is not exist", status: 404 })
      }
    }
  },
  star: {
    notEmpty: true,
    isIn: { options: [[1, 2, 3, 4, 5]], errorMessage: "Star is invalid!" }
  },
  comment: {
    optional: true,
    trim: true,
  }
}, ["body"])