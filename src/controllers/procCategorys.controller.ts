
import { Request, Response } from "express"
import { procCategorysServices } from "~/services/procCategorys.services"


export const createProcCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await procCategorysServices.createProcCategory(req.body)
    return res.status(200).json({ message: "Create ProcCategory successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Create ProcCategory failed", status: 400 })
  }
}
export const updateProcCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { value } = await procCategorysServices.updateProcCategory(id, req.body)
    return res.status(200).json({ message: "Update ProcCategory successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 })
  }
}
export const deleteProcCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await procCategorysServices.deleteProcCategory(id,)
    return res.status(200).json({ message: "Delete ProcCategory successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Delete ProcCategory failed", status: 400 })
  }
}
export const getProcCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await procCategorysServices.getProcCategory(id)
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get ProcCategory failed", status: 400 })
  }
}
export const getAllProcCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await procCategorysServices.getAllProcCategory()
    return res.status(200).json({ message: "Get ProcCategory successfully", status: 200, result })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || "Get all ProcCategory failed", status: 400 })
  }
}