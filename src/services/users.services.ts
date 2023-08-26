import { ObjectId } from "mongodb";
import { ErrroWithStatus, RegisterRequestBody } from "~/constants/type";
import databaseServices from "./database.services";
import { checkPassword, hassPassword } from "~/utils/bcrypt";
import User from "~/models/users.models";
import { generatorToken } from "~/utils/jwt";
import { ErrorStatus } from "~/constants/enum";
import { generatorRefreshToken } from "~/utils/jwt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
class UserServices {
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId();
    await databaseServices.users.insertOne(new User({
      _id: user_id,
      ...payload,
      password: hassPassword(payload.password)
    }))
  }
  async login(email: string, password: string) {
    const user = await databaseServices.users.findOne({ email })
    if (!user) {
      throw new ErrroWithStatus({ message: "User not found!", status: ErrorStatus.NOT_FOUND })
    }
    const isPassword = checkPassword(password, user.password)
    if (!isPassword) {
      throw new ErrroWithStatus({ message: "Password is incoret!", status: ErrorStatus.UNAUTHORIZED })
    }
    const refresh_token = generatorRefreshToken(user._id.toString())
    await databaseServices.users.updateOne({ _id: user._id }, { $set: { refresh_token } })

    return {
      token: generatorToken(user._id.toString()),
      refresh_token
    }
  }
  async refreshToken(refresh_token: string) {
    let accessToken;
    if (!refresh_token) throw new Error("Refresh token not found!")
    const user = await databaseServices.users.findOne({ refresh_token })
    if (!user) throw new Error("User not found!")
    jwt.verify(refresh_token, process.env.JWT_SECRET as string, (err, decoded: any) => {
      if (err || user._id.toString() !== decoded?.id) throw new Error("Refresh token is invalid!")
      accessToken = generatorToken(user._id.toString())
    })
    return accessToken
  }
  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await databaseServices.users.findOne({ password_reset_token: hashedToken, password_reset_expires: { $gt: new Date() } })
    if (!user) throw new Error("Token is invalid or has expired")
    return await databaseServices.users.updateOne({ _id: user._id }, { $set: { password: hassPassword(password), password_reset_token: "", password_reset_expires: undefined, updated_at: new Date() } })
  }
  async logout(refresh_token: string) {
    if (!refresh_token) throw new Error("Refresh token not found!")
    return databaseServices.users.findOneAndUpdate({ refresh_token }, { $set: { refresh_token: "" } })
  }
  async getAllUser() {
    return databaseServices.users.find().toArray()
  }
  async getUserById(user_id: string) {
    return databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  }
  async updateUserById(user_id: ObjectId, payload: any) {
    const isCheck = await this.getUserById(user_id.toString());
    if (isCheck) {
      return databaseServices.users.findOneAndUpdate({ _id: user_id }, { $set: { ...payload, updated_at: new Date() } }, { returnDocument: "after" })
    }
    else {
      return null
    }
  }
  async deleteUserById(user_id: string) {
    const isCheck = await this.getUserById(user_id);
    if (isCheck) {
      return databaseServices.users.deleteOne({ _id: new ObjectId(user_id) })
    }
    else {
      return null
    }
  }
  async blockUser(user_id: string) {
    const isCheck = await this.getUserById(user_id);
    if (isCheck) {
      if (isCheck.blocked) throw new Error("User is blocked!")
      return databaseServices.users.updateOne({ _id: new ObjectId(user_id) }, { $set: { blocked: true } })
    }
    else {
      throw new Error("User not found!")
    }
  }
  async unBlockUser(user_id: string) {
    const isCheck = await this.getUserById(user_id);
    if (isCheck) {
      if (!isCheck.blocked) throw new Error("User has not been blocked")
      return databaseServices.users.findOneAndUpdate({ _id: new ObjectId(user_id) }, { $set: { blocked: false } }, { returnDocument: "after" })
    }
    else {
      throw new Error("User not found!")
    }
  }
  async updatePassword(user_id: string, oldPassword: string, newPassword: string) {
    const user = await this.getUserById(user_id);

    if (!user) {
      throw new Error("User not found!")
    }
    const isPassword = checkPassword(oldPassword, user.password)
    if (!isPassword) throw new Error("Password is incoret!")
    return databaseServices.users.updateOne({ _id: new ObjectId(user_id) }, { $set: { password: hassPassword(newPassword), updated_at: new Date() } })
  }
  async forgotPasswordToken(email: string) {
    const user = await databaseServices.users.findOne({ email })
    if (!user) throw new Error("User not found!")
    const UserCl = new User(user);
    const { resetToken, password_reset_expires, password_reset_token } = await UserCl.createPasswordResetToken();
    await databaseServices.users.updateOne({ _id: user._id }, { $set: { password_reset_token, password_reset_expires, updated_at: new Date() } })
    return resetToken
  }
}
export const userServices = new UserServices()