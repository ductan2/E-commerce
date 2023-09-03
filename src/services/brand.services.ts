
import Brands, { BrandType } from "~/models/brand.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";



class BrandsServices {
  async createBrand(payload: BrandType) {
    return await databaseServices.brands.insertOne(new Brands({ ...payload }))
  }
  async updateBrand(id: string, payload: BrandType) {
    const result= await databaseServices.brands.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    if (result.value === null) throw new ErrroWithStatus({ message: "Brand does not exits!", status: 404 })
    return result
  }
  async deleteBrand(id: string) {
    return await databaseServices.brands.deleteOne({
      _id: new ObjectId(id)
    })
  }
  async getBrand(id: string) {
    return await databaseServices.brands.findOne({
      _id: new ObjectId(id)
    })
  }
  async getAllBrand() {
    return await databaseServices.brands.find().toArray()
  }
}
export const brandsServices = new BrandsServices()