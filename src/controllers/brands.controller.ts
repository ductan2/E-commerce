
import { Request, Response } from "express"
import { UPLOAD_IMAGE_BRAND_TEMP_DIR } from "~/constants/dir"
import { ErrorStatus } from "~/constants/enum"
import { brandsServices } from "~/services/brand.services"
import { initFolder } from "~/utils/file"



export const createBrandController = async (req: Request, res: Response) => {
  try {
    const result = await brandsServices.createBrand(req.body)
    return res.status(200).json({ message: "Create Brand successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Create Brand failed", status: 400 })
  }
}
export const uploadImageBrandController = async (req: Request, res: Response) => {
  initFolder(UPLOAD_IMAGE_BRAND_TEMP_DIR);
  try {
    const { value } = await brandsServices.uploadImage(req)
    return res.status(200).json({ message: "Upload image successfully", status: 200, result: value })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Upload image failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const updateBrandController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { value } = await brandsServices.updateBrand(id, req.body)
    console.log("Hàm this");
    return res.status(200).json({ message: "Update Brand successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 })
  }
}
export const deleteBrandController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await brandsServices.deleteBrand(id,)
    return res.status(200).json({ message: "Delete Brand successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Delete Brand failed", status: 400 })
  }
}
export const getBrandController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await brandsServices.getBrand(id)
    return res.status(200).json({ message: "Get brand successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get Brand failed", status: 400 })
  }
}
export const getAllBrandController = async (req: Request, res: Response) => {
  try {
    const result = await brandsServices.getAllBrand()
    return res.status(200).json({ message: "Get all brand successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get all Brand failed", status: 400 })
  }
}


