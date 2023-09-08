
import { Request, Response } from "express"
import { blogCategorysServices } from "~/services/blogCategorys.services"


export const createBlogCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await blogCategorysServices.createBlogCategory(req.body)
    return res.status(200).json({ message: "Create BlogCategory successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Create BlogCategory failed", status: 400 })
  }
}
export const updateBlogCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { value } = await blogCategorysServices.updateBlogCategory(id, req.body)
    return res.status(200).json({ message: "Update BlogCategory successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(error.status || 400).json({ message: error.message || "Update BlogCategory failed", status: error.status || 400 })
  }
}
export const deleteBlogCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await blogCategorysServices.deleteBlogCategory(id,)
    return res.status(200).json({ message: "Delete BlogCategory successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Delete BlogCategory failed", status: 400 })
  }
}
export const getBlogCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await blogCategorysServices.getBlogCategory(id)
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get BlogCategory failed", status: 400 })
  }
}
export const getAllBlogCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await blogCategorysServices.getAllBlogCategory()
    return res.status(200).json({ message: "Get all BlogCategory successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get all BlogCategory failed", status: 400 })
  }
}
