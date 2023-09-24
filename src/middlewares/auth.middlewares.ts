import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import databaseServices from "~/services/database.services"
import { ObjectId } from "mongodb"
export const authMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
  let token
  if (req?.headers?.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        const { id } = decoded as JwtPayload
        const user = await databaseServices.users.findOne({ _id: new ObjectId(id) })
        req.user = user
        next()
      }
    } catch (error) {
      next(error)
    }
  }
  else {
    return next(new Error("Token not found"))
  }
}
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to access!", status: 403 })
  }
  next()
}