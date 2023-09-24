import express from "express"
import { createBlogController, deleteBlogController, deleteImageController, disLikesBlogController, getAllBlogsController, getBlogController, likesBlogController, updateBlogController, uploadImageController } from "~/controllers/blogs.controller";
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares";
import { BlogValidator, UpdateBlogValidator } from "~/middlewares/blogs.middlewares";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { BlogType } from "~/models/blogs.models";
import { validate } from "~/utils/validate";
const router = express.Router();


router.post("/", authMiddlewares, isAdmin, validate(BlogValidator), createBlogController)

router.get("/get-all", getAllBlogsController)

router.put("/likes", authMiddlewares, likesBlogController)

router.put('/dislikes', authMiddlewares, disLikesBlogController)

router.put('/upload/:id', authMiddlewares, isAdmin, uploadImageController)

router.delete('/delete-image/:id', authMiddlewares, isAdmin, deleteImageController)

router.get("/:id", getBlogController)

router.patch("/:id", authMiddlewares, isAdmin, validate(UpdateBlogValidator),
  filterMiddleware<BlogType>(["author", "category", "description", "title", "numViews", "images"]), updateBlogController)

router.delete("/:id", authMiddlewares, isAdmin, deleteBlogController)




export default router;