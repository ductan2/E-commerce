
import Brands, { BrandType } from "~/models/brand.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";
import { Request } from "express";
import { getFileName, handleuploadImage } from "~/utils/file";
import { UPLOAD_IMAGE_BRAND_DIR, UPLOAD_IMAGE_BRAND_TEMP_DIR } from "~/constants/dir";
import { File } from "formidable";
import path from "path";
import sharp from "sharp";
import fs from "fs"
import { cloudinaryUploadImage } from "~/utils/cloudinary";


class BrandsServices {
  async createBrand(payload: BrandType) {

    return await databaseServices.brands.insertOne(new Brands({ ...payload }))
  }
  async updateBrand(id: string, payload: BrandType) {
    const result = await databaseServices.brands.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    if (result.value === null) throw new ErrroWithStatus({ message: "Brand does not exits!", status: 404 })
    return result
  }
  async uploadImage(req: Request) {
    const files = await handleuploadImage(req, UPLOAD_IMAGE_BRAND_TEMP_DIR) as any;
    let image: any = [];
    await Promise.all(files.map(async (file: File) => {
      const fileName = getFileName(file)
      const newPath = path.resolve(UPLOAD_IMAGE_BRAND_DIR, `${fileName}`)
      console.log(newPath)
      await sharp(file.filepath).jpeg().toFile(newPath)
      fs.unlink(file.filepath, (err) => {
        console.log(err)
      })
      image = await cloudinaryUploadImage(newPath)
    }))
    console.log(image);
    return await databaseServices.brands.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, {
      $set: {
        images: image
      }
    }, { returnDocument: "after" })
  }
  async deleteBrand(id: string) {
    return await databaseServices.brands.deleteOne({
      _id: new ObjectId(id)
    })
  }
  async getBrand(id: string) {
    return await databaseServices.brands.findOne({
      _id: new ObjectId(id)
    })
  }
  async getAllBrand() {
    return await databaseServices.brands.find().toArray()
  }

}
export const brandsServices = new BrandsServices()