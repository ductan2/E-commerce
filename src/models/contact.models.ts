import { ObjectId } from "mongodb";
import { statusContact } from "~/constants/enum";



export interface contactType {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  message: string
  status:statusContact 
  created_at: Date
  updated_at: Date
}
export class Contact {
  _id?: ObjectId
  name: string
  email: string
  phone: string
  message: string
  status:statusContact 
  created_at: Date
  updated_at: Date
  constructor(contact: contactType) {
    const date = new Date();
    this._id = contact._id || new ObjectId()
    this.name = contact.name
    this.email = contact.email
    this.phone = contact.phone
    this.message = contact.message
    this.status = contact.status || statusContact.SUBMITTED
    this.created_at = contact.created_at || date
    this.updated_at = contact.updated_at || date
  }
}