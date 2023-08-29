
import express from "express"
import { checkSchema } from "express-validator"
import { createBlogCategoryController, deleteBlogCategoryController, getAllBlogCategoryController, getBlogCategoryController, updateBlogCategoryController } from "~/controllers/blogCategorys.controller"
import databaseServices from "~/services/database.services"

const router = express.Router()
const blogCategorySchema = checkSchema({
  title: {
    notEmpty: true,
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Title must be at least 2 characters long and less than 50 characters long."
    },
    custom: {
      options: async (value, { req }) => {
        const isUnique = await databaseServices.blogCategorys.findOne({ title: value })
        if (isUnique) {
          throw new Error("Title is already in use")
        }
      }
    }
  }
}, ["body"])


router.post("/", blogCategorySchema, createBlogCategoryController)

router.put("/:id", blogCategorySchema, updateBlogCategoryController)

router.delete("/:id", deleteBlogCategoryController)

router.get("/get-all", getAllBlogCategoryController)

router.get("/:id", getBlogCategoryController)



export default router;