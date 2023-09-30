import { Request, Response } from "express";
import { UPLOAD_IMAGE_PRODUCT_TEMP_DIR } from "~/constants/dir";
import { ErrorStatus } from "~/constants/enum";
import { productServices } from "~/services/products.services";
import { cloudinaryDeleteImage } from "~/utils/cloudinary";
import { initFolder } from "~/utils/file";

export const createProductController = async (req: Request, res: Response) => {
  try {

    const result = await productServices.createProduct(req.body)
    return res.status(200).json({ message: "Product create successfully", status: 200, result })
  } catch (error: any) {
    return res.status(500).json({ message: "Product create failed", status: 500, error: error.message })
  }
}
export const getProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await productServices.getProduct(id)
    return res.status(200).json({ message: "Get a product successfully", status: 200, result })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Get Product failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const getCountProductsController = async (req: Request, res: Response) => {
  try {
    const obj= {...req.query}
    const result = await productServices.getCountProducts(obj)
    return res.status(200).json(result)
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Get count products failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { value } = await productServices.updateProduct(id, req.body)
    return res.status(200).json({ message: "Update Product successfully", status: 200, result: value })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Update Product failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productServices.deleteProduct(id)
    return res.status(200).json({ message: "Delete Product successfully", status: 200 })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Delete Product failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}

export const getAllProductController = async (req: Request, res: Response) => {
  try {

    const queryObj = { ...req.query }
    const result = await productServices.getAllProducts(queryObj)
    return res.status(200).json({ message: "Get Products successfully", status: 200, result })
  } catch (error: any) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: error.message || "Get Products failed", status: ErrorStatus.INTERNAL_SERVER, error })
  }
}
export const addToWishListController = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.body;
    const { value } = await productServices.addToWishList(product_id, req.user)
    return res.status(200).json({ message: "Add to wishlist successfully", status: 200, result: value })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Add to wishlist failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const ratingController = async (req: Request, res: Response) => {
  try {
    const { _id: user_id } = req.user
    const { product_id, star, comment } = req.body
    const { value } = await productServices.rating(product_id, user_id, star, comment);

    return res.status(200).json({ message: "Rating successfully", status: 200, result: value })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Rating failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const uploadImageController = async (req: Request, res: Response) => {
  initFolder(UPLOAD_IMAGE_PRODUCT_TEMP_DIR);
  try {
    const { value } = await productServices.uploadImage(req)
    return res.status(200).json({ message: "Upload image successfully", status: 200, result: value })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Upload image failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const deleteImageController = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const uploader = cloudinaryDeleteImage(id);
    return res.json({ message: "Delete image successfully", status: 200 })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Delete image failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}
export const getAllOrdersController = async (req: Request, res: Response) => {
  try {
    const {search}=req.query
    const result = await productServices.getAllOrders(search as string)
    return res.status(200).json({ message: "Get all orders successfully", status: 200, result })
  } catch (error) {
    return res.json(ErrorStatus.INTERNAL_SERVER).json({ message: "Get all orders failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}