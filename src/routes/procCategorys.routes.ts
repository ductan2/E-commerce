import express from "express"
import { checkSchema } from "express-validator"
import { createProcCategoryController, deleteProcCategoryController, getAllProcCategoryController, getProcCategoryController, updateProcCategoryController } from "~/controllers/procCategorys.controller"
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares"
import databaseServices from "~/services/database.services"
import { validate } from "~/utils/validate"

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


router.post("/",authMiddlewares,isAdmin, validate(procCategorySchema), createProcCategoryController)

router.put("/:id",authMiddlewares,isAdmin,validate(procCategorySchema),updateProcCategoryController)

router.delete("/:id",authMiddlewares,isAdmin,deleteProcCategoryController)

router.get("/get-all",getAllProcCategoryController)

router.get("/:id",getProcCategoryController)



export default router;