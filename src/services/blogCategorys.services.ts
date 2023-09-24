
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";
import BlogCategorys, { BlogCategpryType } from "~/models/blogCategorys.models";


class BlogCategorysServices {
  async createBlogCategory(payload: BlogCategpryType) {
    return await databaseServices.blogCategorys.insertOne(new BlogCategorys({ ...payload, created_at: new Date(), updated_at: new Date() }))
  }
  async updateBlogCategory(id: string, payload: BlogCategpryType) {
    const result = await databaseServices.blogCategorys.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    if (result.value === null) throw new ErrroWithStatus({ message: "BlogCategory does not exits!", status: 404 })
    return result
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