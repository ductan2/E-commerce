
import { Request, Response } from "express"
import { colorsServices } from "~/services/colors.services"



export const createColorsController = async (req: Request, res: Response) => {
  try {
    const result = await colorsServices.createColors(req.body)
    return res.status(200).json({ message: "Create Colors successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Create Colors failed", status: 400 })
  }
}
export const updateColorsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { value } = await colorsServices.updateColors(id, req.body)
    return res.status(200).json({ message: "Update Colors successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 })
  }
}
export const deleteColorsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await colorsServices.deleteColors(id,)
    return res.status(200).json({ message: "Delete Colors successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Delete Colors failed", status: 400 })
  }
}
export const getColorsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await colorsServices.getColors(id)
    return res.status(200).json({ message: "Get a color successfully", status: 200, result })

  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get Colors failed", status: 400 })
  }
}
export const getAllColorsController = async (req: Request, res: Response) => {
  try {
    const result = await colorsServices.getAllColors()
    return res.status(200).json({ message: "Get all Colors successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get all Colors failed", status: 400 })
  }
}


