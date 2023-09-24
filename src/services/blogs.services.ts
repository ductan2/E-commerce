import Blogs, { BlogType } from "~/models/blogs.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";
import { getFileName, handleuploadImage } from "~/utils/file";
import { Request } from "express";
import path from "path";
import { UPLOAD_IMAGE_BLOG_DIR, UPLOAD_IMAGE_BLOG_TEMP_DIR, UPLOAD_IMAGE_PRODUCT_TEMP_DIR } from "~/constants/dir";
import sharp from "sharp";
import { File } from "formidable";
import fs from "fs"
import { cloudinaryUploadImage } from "~/utils/cloudinary";

class BlogServices {
  async createBlog(payload: BlogType) {
    if (payload.category) {
      payload.category = payload.category.map((item) => new ObjectId(item))
    }
    const result = await databaseServices.blogs.insertOne(new Blogs({
      ...payload,
    }))
    return result
  }

  async getBlog(id: string) {
    let getBlog;

    const blogUpdateResult = await databaseServices.blogs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    if (!blogUpdateResult.value) {
      throw new ErrroWithStatus({ message: "Blog not found", status: 404 });
    }

    const blog = blogUpdateResult.value;

    const userLikePromises = (blog.likes as string[]).map(async (userId: string) => {
      const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
      return user;
    });

    const userDislikesPromises = (blog.dislikes as string[]).map(async (userId: string) => {
      const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
      return user;
    });
    const [likedUsers, dislikedUsers] = await Promise.all([
      Promise.all(userLikePromises),
      Promise.all(userDislikesPromises)
    ]);
    getBlog = {
      ...blog,
      likes: likedUsers,
      dislikes: dislikedUsers,
    };
    return getBlog;
  }
  // async getBlog(id: string) {
  //   let getBlog;
  //   await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { views: 1 } })
  //   await databaseServices.blogs.findOne({ _id: new ObjectId(id) }).then((blog) => {
  //     console.log("🚀 ~ file: blogs.services.ts:27 ~ BlogServices ~ awaitdatabaseServices.blogs.findOne ~ blog:", blog)
  //     const user = (blog?.likes as string[]).find(async (item: string) => {
  //       return databaseServices.users.findOne({ _id: new ObjectId(item.toString()) })
  //     })
  //     getBlog = {
  //       ...blog, likes: user
  //     }
  //   });
  //   return getBlog;
  // }
  async getAllBlogs(obj: { title?: string, sort?: string }) {
    let query: any = {
      title: { $regex: new RegExp(obj.title || "", "i") },
    }
    let querySort={}
    if (obj.sort) {
      querySort = obj.sort ? { [obj.sort]: obj.sort === 'desc' ? -1 : 1 } : { created_at: 1 };
    }
    return await databaseServices.blogs.find(query).sort(querySort).toArray()
  }
  async updateBlog(id: string, payload: BlogType) {
    if (payload.category) {
      payload.category = payload.category.map((item) => new ObjectId(item))
    }
    const result = await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id) }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    if (result.value === null) throw new ErrroWithStatus({ message: "Blog not found", status: 404 })
    return result
  }
  async deleteBlog(id: string) {
    const { deletedCount } = await databaseServices.blogs.deleteOne({ _id: new ObjectId(id) })
    if (deletedCount === 0) throw new ErrroWithStatus({ message: "Blog not found", status: 404 })
    return deletedCount
  }
  async likesBlog(id_blog: string, user_id: string) {
    //find blog by id
    const blog = await databaseServices.blogs.findOne({ _id: new ObjectId(id_blog) })
    const isLike = blog?.isLiked
    // check if user has dislike this blog
    const alreadyDislike = (blog?.dislikes as string[]).find((item: string) => item.toString() === user_id.toString())

    if (alreadyDislike) {
      await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id_blog) }, { $set: { isDisliked: false }, $pull: { dislikes: user_id } }, { returnDocument: "after" })
    }
    if (isLike) {
      const newBlog = await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id_blog) }, { $set: { isLiked: false }, $pull: { likes: user_id } }, { returnDocument: "after" })
      return newBlog
    }
    else {
      return await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id_blog) }, { $set: { isLiked: true }, $push: { likes: user_id } }, { returnDocument: "after" })
    }
  }
  async dislikesBlog(id_blog: string, user_id: string) {
    //find blog by id
    const blog = await databaseServices.blogs.findOne({ _id: new ObjectId(id_blog) })
    const isDislikes = blog?.isDisliked
    // check if user has dislike this blog
    const alreadyLike = (blog?.likes as string[]).find((item: string) => item.toString() === user_id.toString())
    if (alreadyLike) {
      await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id_blog) }, { $set: { isLiked: false }, $pull: { likes: user_id } }, { returnDocument: "after" })
    }
    if (isDislikes) {
      return await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id_blog) }, { $set: { isDisliked: false }, $pull: { dislikes: user_id } }, { returnDocument: "after" })
    }
    else {
      return await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id_blog) }, { $set: { isDisliked: true }, $push: { dislikes: user_id } }, { returnDocument: "after" })
    }
  }
  async uploadImage(req: Request) {
    const files = await handleuploadImage(req, UPLOAD_IMAGE_BLOG_TEMP_DIR) as any;
    let image: any = [];
    await Promise.all(files.map(async (file: File) => {
      const fileName = getFileName(file)
      const newPath = path.resolve(UPLOAD_IMAGE_BLOG_DIR, `${fileName}`)
      console.log(newPath)
      await sharp(file.filepath).jpeg().toFile(newPath)
      fs.unlink(file.filepath, (err) => {
        console.log(err)
      })
      image = await cloudinaryUploadImage(newPath)
    }))
    console.log(image);
    return await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, {
      $set: {
        images: image
      }
    }, { returnDocument: "after" })
  }
}

export const blogServices = new BlogServices()