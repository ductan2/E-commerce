
import express from "express"
import { checkSchema } from "express-validator"
import { createBrandController, deleteBrandController, getAllBrandController, getBrandController, updateBrandController } from "~/controllers/brands.controller"
import databaseServices from "~/services/database.services"

const router = express.Router()
const brandSchema = checkSchema({
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


router.post("/", brandSchema, createBrandController)

router.put("/:id", brandSchema, updateBrandController)

router.delete("/:id", deleteBrandController)

router.get("/get-all", getAllBrandController)

router.get("/:id", getBrandController)



export default router;