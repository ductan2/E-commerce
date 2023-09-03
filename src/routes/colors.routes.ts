
import express from "express"
import { checkSchema } from "express-validator"
import { createColorsController, deleteColorsController, getAllColorsController, getColorsController, updateColorsController } from "~/controllers/colors.controllers"
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares"
import databaseServices from "~/services/database.services"
import { validate } from "~/utils/validate"

const router = express.Router()
const colorsSchema = checkSchema({
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
        const isUnique = await databaseServices.colors.findOne({ title: value })
        if (isUnique) {
          throw new Error("Title is already in use")
        }
      }
    }
  }
}, ["body"])


router.post("/",authMiddlewares,isAdmin, validate(colorsSchema), createColorsController)

router.put("/:id",authMiddlewares,isAdmin, validate(colorsSchema), updateColorsController)

router.delete("/:id", authMiddlewares,isAdmin,deleteColorsController)

router.get("/get-all", getAllColorsController)

router.get("/:id", getColorsController)



export default router;