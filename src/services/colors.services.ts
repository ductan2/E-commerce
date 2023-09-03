
import { ColorType, Colors } from "~/models/colors.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";


class ColorsServices {
  async createColors(payload: ColorType) {
    return await databaseServices.colors.insertOne(new Colors({ ...payload }))
  }
  async updateColors(id: string, payload: ColorType) {
    const result = await databaseServices.colors.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    if (result.value === null) throw new ErrroWithStatus({ message: "Colors does not exits!", status: 404 })
    return result
  }
  async deleteColors(id: string) {
    return await databaseServices.colors.deleteOne({
      _id: new ObjectId(id)
    })
  }
  async getColors(id: string) {
    return await databaseServices.colors.findOne({
      _id: new ObjectId(id)
    })
  }
  async getAllColors() {
    return await databaseServices.colors.find().toArray()
  }
}
export const colorsServices = new ColorsServices()