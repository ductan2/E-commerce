import { Request } from "express";
import { File } from "formidable";
import path from "path";
import sharp from "sharp";
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from "~/constants/dir";
import { getFileName, handleuploadImage } from "~/utils/file";
import fs from "fs"
import { cloudinaryUploadImage } from "~/utils/cloudinary";
class UploadServices {
  async uploadImage(req: Request) {
    const files = await handleuploadImage(req, UPLOAD_IMAGE_TEMP_DIR) as any;
    const urls: any[] = []
    await Promise.all(files.map(async (file: File) => {

      const fileName = getFileName(file)
      const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${fileName}`)

      await sharp(file.filepath).jpeg().toFile(newPath)

      fs.unlink(file.filepath, (err) => {
        console.log(err)
      })
      urls.push(await cloudinaryUploadImage(newPath))
    }))

    return urls
  }
}

export const uploadServices = new UploadServices()