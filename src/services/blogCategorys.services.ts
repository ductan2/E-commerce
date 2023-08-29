
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import BlogCategorys, { BlogCategpryType } from "~/models/blogCategorys.models";


class BlogCategorysServices {
  async createBlogCategory(payload: BlogCategpryType) {
    return await databaseServices.blogCategorys.insertOne(new BlogCategorys({ ...payload }))
  }
  async updateBlogCategory(id: string, payload: BlogCategpryType) {
    return await databaseServices.blogCategorys.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
  }
  async deleteBlogCategory(id: string) {
    return await databaseServices.blogCategorys.deleteOne({
      _id: new ObjectId(id)
    })
  }
  async getBlogCategory(id: string) {
    return await databaseServices.blogCategorys.findOne({
      _id: new ObjectId(id)
    })
  }
  async getAllBlogCategory() {
    return await databaseServices.blogCategorys.find().toArray()
  }
}
export const blogCategorysServices = new BlogCategorysServices()