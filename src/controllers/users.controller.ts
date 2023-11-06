import { Request, RequestHandler, Response } from "express";
import { ErrorStatus } from "~/constants/enum";
import { EmailData, LoginRequestBody, RegisterRequestBody } from "~/constants/type";
import { userServices } from "~/services/users.services";
import { sendEmail } from "./email.controller";
import { config } from "dotenv";
config()


export const registerController: RequestHandler<{}, {}, RegisterRequestBody> = async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  try {
    await userServices.register({ firstname, lastname, email, mobile, password })
    return res.status(201).json({ message: "Register successfully", status: 201 })
  } catch (error: any) {
    return res.status(ErrorStatus.INTERNAL_SERVER).json({ error: error.message || "Register failed", status: ErrorStatus.INTERNAL_SERVER })
  }
}

export const loginController: RequestHandler<{}, {}, LoginRequestBody> = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await userServices.login(email, password)
    res.cookie('refresh_token', result.refresh_token, { httpOnly: true, maxAge: 60 * 1000 }) // 3 days = 72 * 60 * 60 * 1000
    return res.status(200).json({ message: "Login successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.INTERNAL_SERVER).json([{ error: error.message || "Login failed", status: ErrorStatus.INTERNAL_SERVER, path: error.path }])
  }
}

export const loginAdminController: RequestHandler<{}, {}, LoginRequestBody> = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await userServices.loginAdmin(email, password)
    res.cookie('refresh_token', result.refresh_token, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 })
    return res.status(200).json({ message: "Login successfully", status: 200, result: { ...result.data, token: result.token } })
  } catch (error: any) {
    return res.status(ErrorStatus.INTERNAL_SERVER).json({ error: error.message || "Login failed", status: error.status || ErrorStatus.INTERNAL_SERVER })
  }
}

export const getInfoTokenController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user
    const result = await userServices.getInfoByToken(_id)
    return res.status(200).json({ message: "Get info token successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.INTERNAL_SERVER).json({ error: error.message || "Login failed", status: error.status || ErrorStatus.INTERNAL_SERVER })
  }
}
export const forgotPasswordTokenController: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body
    const token = await userServices.forgotPasswordToken(email)
    const resetUrl = `Hi ${email}, please click this link to reset your password:
     <a href="${process.env.HOST_FRONTEND}/${token}">Reset password</a>`
    const data: EmailData = {
      to: email,
      text: `Hey ${email}`,
      subject: "Reset password",
      html: resetUrl
    }
    sendEmail(data, req, res)
    return res.status(200).json({ message: "Send forgot password token successfully", status: 200, token })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Send forgot password token failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const resetPasswordController: RequestHandler = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body
    const result = await userServices.resetPassword(token, password)

    return res.status(200).json({ message: "Reset password successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Reset password failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const getAllUserController: RequestHandler = async (req, res) => {
  try {
    const result = await userServices.getAllUser()
    return res.status(200).json({ message: "Get user successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.FORBIDDEN).json({ error: error.message || "Get user failed", status: ErrorStatus.FORBIDDEN })
  }
}
export const getUserController: RequestHandler = async (req, res) => {
  const { id } = req.params
  try {
    const result = await userServices.getUserById(id)
    if (result === null) {
      return res.status(ErrorStatus.NOT_FOUND).json({ message: "User not found!", status: ErrorStatus.NOT_FOUND })
    }
    return res.status(200).json({ message: "Get user successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.FORBIDDEN).json({ error: error.message || "Get user failed", status: ErrorStatus.FORBIDDEN })
  }
}
export const getEmptyCartController = async (req: Request, res: Response) => {
  const { _id } = req.user
  try {
    const result = await userServices.emptyCart(_id)
    return res.status(200).json({ message: "Empty cart successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Empty cart failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const applyCouponController = async (req: Request, res: Response) => {
  const { coupon } = req.body
  const { _id } = req.user
  try {
    const result = await userServices.applyCoupon(coupon, _id)
    return res.status(200).json({ message: "Apply coupon successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Apply coupon failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const updateUserController = async (req: Request, res: Response) => {
  const { _id } = req.user
  console.log("🚀 ~ file: users.controller.ts:123 ~ updateUserController ~ _id:", _id)
  console.log(req.body)
  try {
    const { value } = await userServices.updateUserById(_id, req.body)
    return res.status(200).json({ message: "Update user successfully", status: 200, result: value })
  } catch (error) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: "Update user failed", status: ErrorStatus.BAD_REQUEST, error })
  }
}

export const deleteUserController: RequestHandler = async (req, res) => {
  const { id } = req.params
  try {
    const result = await userServices.deleteUserById(id)
    if (result === null) {
      return res.status(ErrorStatus.NOT_FOUND).json({ message: "User not found!", status: ErrorStatus.NOT_FOUND })
    }
    return res.status(200).json({ message: "Delete user successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.INTERNAL_SERVER).json({ message: "Delete user failed", status: ErrorStatus.INTERNAL_SERVER, error: error.message })
  }
}

export const blockUserController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const result = await userServices.blockUser(id)
    return res.status(200).json({ message: "Block user successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: "Block user failed", status: ErrorStatus.BAD_REQUEST, error: error.message })
  }
}

export const unBlockUserController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params
    const result = await userServices.unBlockUser(id)
    return res.status(200).json({ message: "Unblock user successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: "Unblock user failed", status: ErrorStatus.BAD_REQUEST, error: error.message })
  }
}
export const refreshTokenController: RequestHandler = async (req, res) => {
  try {
    const cookie = req.cookies;
    const result = await userServices.refreshToken(cookie.refresh_token)
    return res.status(200).json({ message: "Refresh token successfully", status: 200, access_token: result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Refresh token failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const updatePasswordController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user
    const { oldPassword, newPassword } = req.body
    const result = await userServices.updatePassword(_id, oldPassword, newPassword)
    return res.status(200).json({ message: "Update password successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Update password failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const logoutController: RequestHandler = async (req, res) => {
  try {
    const { _id } = (req as Request).user
    await userServices.logout(_id)
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true
    })
    return res.sendStatus(204)
  } catch (error: any) {
    return res.status(ErrorStatus.FORBIDDEN).json({ error: error.message || "Logout failed", status: ErrorStatus.FORBIDDEN })
  }
}
export const getWishListController = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getWishList(req.user.email)
    return res.status(200).json({ message: "Get wishlist successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get wishlist failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const userAddCartController = async (req: Request, res: Response) => {
  try {
    const { cart } = req.body
    const { _id } = req.user
    const result = await userServices.addCartByUserId(_id, cart)
    return res.status(200).json({ message: "Get cart successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get cart failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const updateAddressUserController = async (req: Request, res: Response) => {
  try {
    const { id_address } = req.params;
    const { _id } = req.user;
    const { address } = req.body;

    const { value } = await userServices.updateAddressUser(id_address, _id, address[0])
    return res.status(200).json({ message: "Update address successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Update address user failed", status: ErrorStatus.BAD_REQUEST })
  }
}

export const deleteAddressUserController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const { id_address } = req.params;
    const { value } = await userServices.deleteAddressUser(_id, id_address);
    return res.status(200).json({ message: "Delete address successfully", status: 200, result: value })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Delete address user failed", status: ErrorStatus.BAD_REQUEST })

  }
}

export const getUserCartController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const result = await userServices.getUserCart(_id)
    return res.status(200).json({ message: "Get cart successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get cart failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const deleteCartController = async (req: Request, res: Response) => {
  try {
    const { _id: user_id } = req.user;
    const { cart_id } = req.params
    const result = await userServices.deleteCart(user_id, cart_id)
    return res.status(200).json({ message: "Get cart successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get cart failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const createOrderController = async (req: Request, res: Response) => {
  const { COD, couponApplied, payment_id, address } = req.body
  try {
    const { _id } = req.user;
    const result = await userServices.createOrder(_id, COD, couponApplied, payment_id, address)
    return res.status(200).json({ message: "Create order successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Create order failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const getOrderByUserController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const result = await userServices.getOrderByUser(_id)
    return res.status(200).json({ message: "Get order successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get order failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const getOrderController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const { order_id } = req.params
    const result = await userServices.getOrder(_id, order_id)
    return res.status(200).json({ message: "Get order successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get order failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const updateCartQuantityController = async (req: Request, res: Response) => {
  try {
    const { cart_id } = req.params;
    const { _id: user_id } = req.user;
    const { amount } = req.body;
    const result = await userServices.updateCartQuantity(amount, user_id, cart_id)
    return res.status(200).json({ message: "Update cart successfully", status: 200, result })
  } catch (error: any) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ error: error.message || "Update cart failed", status: ErrorStatus.BAD_REQUEST })
  }
}
export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { cart_id } = req.params;
    const { status } = req.body;
    const { _id: id_user } = req.user
    const result = await userServices.updateOrderStatus(id_user, cart_id, status)
    return res.status(200).json({ message: "Update order status successfully", status: 200, result })
  } catch (error) {
    return res.status(ErrorStatus.BAD_REQUEST).json({ message: "Update order status failed", status: ErrorStatus.BAD_REQUEST, error })
  }
}