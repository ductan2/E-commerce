

import { Contact, contactType } from "~/models/contact.models";
import databaseServices from "./database.services";
import { ObjectId } from "mongodb";
import { ErrroWithStatus } from "~/constants/type";

class ContactServices {
  async createContact(payload: contactType) {
    return await databaseServices.contact.insertOne(new Contact({ ...payload }))
  }
  async updateContact(id: string, payload: contactType) {
    const result =  await databaseServices.contact.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        ...payload, updated_at: new Date()
      }
    }, { returnDocument: "after" })
    console.log("🚀 ~ file: contact.services.ts:19 ~ ContactServices ~ updateContact ~ result:", result)
    if(result.value===null) throw new ErrroWithStatus({ message: "Contact does not exits!", status: 404 })
    return result
  }
  async deleteContact(id: string) {
    return await databaseServices.contact.deleteOne({
      _id: new ObjectId(id)
    })
  }
  async getContact(id: string) {
    return await databaseServices.contact.findOne({
      _id: new ObjectId(id)
    })
  }
  async getAllContact() {
    return await databaseServices.contact.find().toArray()
  }
}
export const contactServices = new ContactServices()