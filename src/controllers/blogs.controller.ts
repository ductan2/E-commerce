import { Request, Response } from "express";
import { UPLOAD_IMAGE_BLOG_TEMP_DIR } from "~/constants/dir";
import { ErrorStatus } from "~/constants/enum";
import { blogServices } from "~/services/blogs.services";
import { cloudinaryDeleteImage } from "~/utils/cloudinary";
import { initFolder } from "~/utils/file";


export const createBlogController = async (req: Request, res: Response) => {
  try {
    const result = await blogServices.createBlog(req.body)
    return res.status(200).json({ message: "Create Blog successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: error.message || "Create Blog failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const getBlogController = async (req: Request, res: Response) => {
  try {
    const result = await blogServices.getBlog(req.params.id)
    return res.status(200).json({ message: "Get Blog successfully", status: 200, result })
  } catch (error: any) {
    return res.status(error.status || ErrorStatus.BAD_REQUEST).json({ message: error.message || "Get Blog failed", status: error.status || ErrorStatus.NOT_FOUND })
  }
}

export const getAllBlogsController = async (req: Request, res: Response) => {
  try {
    const obj={...req.query}
    const result = await blogServices.getAllBlogs(obj)
    return res.status(200).json({ message: "Get All Blogs successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: error.message || "Get All Blogs failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const updateBlogController = async (req: Request, res: Response) => {
  try {
    const { value } = await blogServices.updateBlog(req.params.id, req.body)
    return res.status(200).json({ message: "Update Blog successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: error.message || "Update Blog failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const deleteBlogController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await blogServices.deleteBlog(id)
    return res.status(200).json({ message: "Delete Blog successfully", status: 200 })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: error.message || "Delete Blog failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const likesBlogController = async (req: Request, res: Response) => {
  try {
    const { id_blog } = req.body
    const { _id: user_id } = req.user
    const { value } = await blogServices.likesBlog(id_blog, user_id)
    return res.status(200).json({ message: "Likes Blog successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: error.message || "Likes Blog failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const disLikesBlogController = async (req: Request, res: Response) => {
  try {
    const { id_blog } = req.body
    const { _id: user_id } = req.user
    const { value } = await blogServices.dislikesBlog(id_blog, user_id)
    return res.status(200).json({ message: "Dislike Blog successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: error.message || "Dislike Blog failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const uploadImageController = async (req: Request, res: Response) => {
  initFolder(UPLOAD_IMAGE_BLOG_TEMP_DIR);
  try {
    const { value } = await blogServices.uploadImage(req)
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