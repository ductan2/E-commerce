import Blogs, { BlogType } from "~/models/blogs.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";
import { JwtPayload } from "jsonwebtoken";


class BlogServices {
  async createBlog(payload: BlogType) {
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
  async getAllBlogs() {
    const result = await databaseServices.blogs.find({}).toArray()
    return result
  }
  async updateBlog(id: string, payload: BlogType) {
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
}

export const blogServices = new BlogServices()