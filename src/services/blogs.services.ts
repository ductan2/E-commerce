import Blogs, { BlogType } from "~/models/blogs.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrorWithStatus } from "~/constants/type";
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
    // Increment the views and get the blog in one operation
    const blogUpdateResult = await databaseServices.blogs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { numViews: 1 } },
      { returnDocument: 'after' }  // Ensure the updated document is returned
    );

    if (!blogUpdateResult.value) {
      throw new ErrorWithStatus({ message: "Blog not found", status: 404 });
    }

    const blog = blogUpdateResult.value;

    const categoryIds = blog.category.map((item: any) => new ObjectId(item));
    const likeUserIds = blog.likes.map((userId) => new ObjectId(userId.toString()));
    const dislikeUserIds = blog.dislikes.map((userId) => new ObjectId(userId.toString()));

    const [blogCategories, likedUsers, dislikedUsers] = await Promise.all([
      databaseServices.blogCategorys.find({ _id: { $in: categoryIds } }).toArray(),
      databaseServices.users.find({ _id: { $in: likeUserIds } }).toArray(),
      databaseServices.users.find({ _id: { $in: dislikeUserIds } }).toArray()
    ]);

    return {
      ...blog,
      likes: likedUsers,
      dislikes: dislikedUsers,
      category: blogCategories
    };
  }
  // async getBlog(id: string) {
  //   let getBlog;

  //   const blogUpdateResult = await databaseServices.blogs.findOneAndUpdate(
  //     { _id: new ObjectId(id) },
  //     { $inc: { views: 1 } }
  //   );

  //   if (!blogUpdateResult.value) {
  //     throw new ErrorWithStatus({ message: "Blog not found", status: 404 });
  //   }

  //   const blog = blogUpdateResult.value;
  //   const arrayCategoory = blog.category.map(async (item: any) => {
  //     return await databaseServices.blogCategorys.findOne({ _id: new ObjectId(item) });
  //   })
  //   const userLikePromises = (blog.likes as string[]).map(async (userId: string) => {
  //     const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
  //     return user;
  //   });

  //   const userDislikesPromises = (blog.dislikes as string[]).map(async (userId: string) => {
  //     const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
  //     return user;
  //   });

  //   const [likedUsers, dislikedUsers, blogCategorys] = await Promise.all([
  //     Promise.all(userLikePromises),
  //     Promise.all(userDislikesPromises),
  //     Promise.all(arrayCategoory)
  //   ]);
  //   getBlog = {
  //     ...blog,
  //     likes: likedUsers,
  //     dislikes: dislikedUsers,
  //     category: blogCategorys
  //   };
  //   return getBlog;
  // }
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
    let querySort: any = { created_at: 1 }; // Default sort
    if (obj.sort) {
      const sortDirection = obj.sort === 'desc' ? -1 : 1;
      querySort = { [obj.sort]: sortDirection };
    }


    const pipe = [
      {
        $match: {
          ...query
        }
      },
      {
        $lookup: {
          from: "blogCategorys",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      // sort 
      {
        $sort: querySort
      }
    ];

    return await databaseServices.blogs.aggregate(pipe).toArray();
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
    if (result.value === null) throw new ErrorWithStatus({ message: "Blog not found", status: 404 })
    return result
  }
  async deleteBlog(id: string) {
    const { deletedCount } = await databaseServices.blogs.deleteOne({ _id: new ObjectId(id) })
    if (deletedCount === 0) throw new ErrorWithStatus({ message: "Blog not found", status: 404 })
    return deletedCount
  }
  async likesBlog(id_blog: string, user_id: string) {
    //find blog by id
    const blog = await databaseServices.blogs.findOne({ _id: new ObjectId(id_blog) })
    if(!blog) throw new Error("Blog not found")
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