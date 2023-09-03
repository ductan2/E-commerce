
import { Request, Response } from "express"
import { contactServices } from "~/services/contact.services"



export const createContactController = async (req: Request, res: Response) => {
  try {
    const result = await contactServices.createContact(req.body)
    return res.status(200).json({ message: "Create Contact successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Create Contact failed", status: 400 })
  }
}
export const updateContactController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { value } = await contactServices.updateContact(id, req.body)
    return res.status(200).json({ message: "Update Contact successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(error.status || 400).json({ message: error.message || "Update Contact failed", status: error.status || 400 })
  }
}
export const deleteContactController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await contactServices.deleteContact(id,)
    return res.status(200).json({ message: "Delete Contact successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Delete Contact failed", status: 400 })
  }
}
export const getContactController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await contactServices.getContact(id)
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get Contact failed", status: 400 })
  }
}
export const getAllContactController = async (req: Request, res: Response) => {
  try {
    const result = await contactServices.getAllContact()
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get all Contact failed", status: 400 })
  }
}


