import { checkSchema } from "express-validator";

export const BlogValidator = checkSchema({
  title: {
    notEmpty: true,
    trim:true,
    isString:true,
    isLength: {
      options: {
        min: 5,
        max: 50,
      },
      errorMessage: "title must be at least 5 characters long and less than 25 characters long."
    },
  },
  description: {
    notEmpty: true,
    trim: true,
    isString:true,
    isLength: {
      options: { min: 5 },
      errorMessage: "Description must be at least 5 chars and max 1000 chars",
    },
  },
  category: {
    notEmpty: true,
    trim: true,
    isString:true,
    isLength: {
      options: { min: 5, max: 100 },
      errorMessage: "Category must be between 5 and 100 characters long",
    },
  },
  numViews: {
    optional: true,
    isNumeric: true,
    errorMessage: "Number of views must be a valid number",
  },
  images: {
    optional: true,
    trim: true,
    isString: true,
    errorMessage: "Images must be a string",
  },
  author: {
    optional: true,
    trim: true,
    isString: true,
    errorMessage: "Author must be a string",
  },
}, ["body"])
export const UpdateBlogValidator = checkSchema({
  title: {
    optional: true,
    trim: true,
    isString: true,
    isLength: {
      options: { min: 5, max: 100 },
      errorMessage: "Title must be between 5 and 100 characters long",
    },
  },
  description: {
    optional: true,
    trim: true,
    isString: true,
    isLength: {
      options: { min: 5, max: 1000 },
      errorMessage: "Description must be between 5 and 1000 characters long",
    },
  },
  category: {
    optional: true,
    trim: true,
    isString: true,
    isLength: {
      options: { min: 5, max: 100 },
      errorMessage: "Category must be between 5 and 100 characters long",
    },
  },
  numViews: {
    optional: true,
    isNumeric: true,
    errorMessage: "Number of views must be a valid number",
  },
  images: {
    optional: true,
    trim: true,
    isString: true,
    errorMessage: "Images must be a string",
  },
  author: {
    optional: true,
    trim: true,
    isString: true,
    errorMessage: "Author must be a string",
  },
}, ["body"]);