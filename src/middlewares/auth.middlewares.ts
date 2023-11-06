import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import databaseServices from "~/services/database.services"
import { ObjectId } from "mongodb"
export const authMiddlewares = async (req: Request, res: Response, next: NextFunction) => {
  let token
  if (req?.headers?.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
      const expNow = Date.now() / 1000;
      const { exp } = decoded as JwtPayload;
      if (Number(exp) < expNow) return res.status(401).json({ message: "Token has expired", status: 401 })
      const { id } = decoded as JwtPayload
      const user = await databaseServices.users.findOne({ _id: new ObjectId(id) })
      req.user = user
      next()

    } catch (error) {
      return res.status(401).json({ message: "Token is invalid", status: 401 })
    }
  }
  else {
    return res.status(401).json({ message: "Token is invalid", status: 401 })
  }
}
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "You do not have permission to access!", status: 403 })
  }
  next()
}