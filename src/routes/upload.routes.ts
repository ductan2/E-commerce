
import express, { Request, Response } from "express"
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from "~/constants/dir";
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares"
import { uploadServices } from "~/services/upload.services";
import { cloudinaryDeleteImage } from "~/utils/cloudinary";
import { initFolder } from "~/utils/file";


const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  initFolder(UPLOAD_IMAGE_TEMP_DIR);
  try {
    const result = await uploadServices.uploadImage(req)
    return res.status(200).json({ message: "Upload image successfully", status: 200, result })
  } catch (error) {
    return res.json({ message: "Upload image failed", status: 400 })
  }
})

router.delete('/delete-image/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const uploader = cloudinaryDeleteImage(id);
    return res.json({ message: "Delete image successfully", status: 200 })
  } catch (error) {
    return res.json(500).json({ message: "Delete image failed", status: 500 })
  }
})


export default router;