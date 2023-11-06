import ProcCategorys, { ProcCategpryType } from "~/models/procCategorys.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrorWithStatus } from "~/constants/type";


class ProcCategorysServices {
  async createProcCategory(payload: ProcCategpryType) {
    return await databaseServices.productCategorys.insertOne(new ProcCategorys({ ...payload }))
  }
  async updateProcCategory(id: string, payload: ProcCategpryType) {
    const result = await databaseServices.productCategorys.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    if (result.value === null) throw new ErrorWithStatus({ message: "BlogCategory does not exits!", status: 404 })
    return result
  }
  async deleteProcCategory(id: string) {
    return await databaseServices.productCategorys.deleteOne({
      _id: new ObjectId(id)
    })
  }
  async getProcCategory(id: string) {
    return await databaseServices.productCategorys.findOne({
      _id: new ObjectId(id)
    })
  }
  async getAllProcCategory() {
    return await databaseServices.productCategorys.find().sort({ title: 1 }).toArray()
  }
}
export const procCategorysServices = new ProcCategorysServices()