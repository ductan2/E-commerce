
import express from "express"
import { createContactController, deleteContactController, getAllContactController, getContactController, updateContactController } from "~/controllers/contact.controller"
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares"
import { contactSchema, updateContactSchema } from "~/middlewares/contact.middlewares"
import { validate } from "~/utils/validate"

const router = express.Router()



router.post("/", validate(contactSchema), createContactController)

router.put("/:id", authMiddlewares, isAdmin, validate(updateContactSchema), updateContactController)

router.delete("/:id", authMiddlewares, isAdmin, deleteContactController)

router.get("/get-all", authMiddlewares, isAdmin, getAllContactController)

router.get("/:id", authMiddlewares, isAdmin, getContactController)



export default router;