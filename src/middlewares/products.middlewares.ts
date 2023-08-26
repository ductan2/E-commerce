import { checkSchema } from "express-validator";


export const ProductsValidator = checkSchema({
  title: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Title must be at least 2 characters long and less than 25 characters long."
    },
  },
  slug: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
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
        max: 500,
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
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Category must be at least 2 characters long and less than 25 characters long."
    },
  },
  brand: {
    isIn: { options: [["Apple", "Samsung", "Lenovo", "Xiaomi", "No brand"]], errorMessage: "Brand is invalid!" }
  },
  quantity: {
    notEmpty: true,
    isNumeric: true,
  },
}, ["body"])
export const UpdateProductValidator = checkSchema({
  title: {
    trim: true,
    optional:true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Title must be at least 2 characters long and less than 25 characters long."
    },
  },
  slug: {
    trim: true,
    optional:true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Slug must be at least 2 characters long and less than 25 characters long."
    },
  },
  description: {
    trim: true,
    optional:true,
    isLength: {
      options: {
        min: 2,
        max: 500,
      },
      errorMessage: "Description must be at least 2 characters long and less than 25 characters long."
    },
  },
  price: {
    isNumeric: true,
    optional:true,
    errorMessage: "Price must be a number"
  },
  category: {
    optional:true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Category must be at least 2 characters long and less than 25 characters long."
    },
  },
  brand: {
    optional:true,
    isIn: { options: [["Apple", "Samsung", "Lenovo", "Xiaomi", "No brand"]], errorMessage: "Brand is invalid!" }
  },
  quantity: {
    optional:true,
    isNumeric: true,
  },
}, ["body"])