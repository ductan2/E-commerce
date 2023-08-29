import express from "express"
import { checkSchema } from "express-validator"
import { createProcCategoryController, deleteProcCategoryController, getAllProcCategoryController, getProcCategoryController, updateProcCategoryController } from "~/controllers/procCategorys.controller"
import databaseServices from "~/services/database.services"

const router = express.Router()
const procCategorySchema = checkSchema({
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
        const isUnique = await databaseServices.productCategorys.findOne({ title: value })
        if (isUnique) {
          throw new Error("Title is already in use")
        }
      }
    }
  }
}, ["body"])


router.post("/", procCategorySchema, createProcCategoryController)

router.put("/:id",procCategorySchema,updateProcCategoryController)

router.delete("/:id",deleteProcCategoryController)

router.get("/get-all",getAllProcCategoryController)

router.get("/:id",getProcCategoryController)



export default router;