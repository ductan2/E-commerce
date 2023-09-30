import { ObjectId, WithId } from "mongodb";
import { ErrroWithStatus, ProductOrder, RegisterRequestBody, UpdateInfo } from "~/constants/type";
import databaseServices from "./database.services";
import { checkPassword, hassPassword } from "~/utils/bcrypt";
import User, { UserType } from "~/models/users.models";
import { generatorToken } from "~/utils/jwt";
import { ErrorStatus, statusOrder } from "~/constants/enum";
import { generatorRefreshToken } from "~/utils/jwt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { CartType, Carts } from "~/models/carts.models";
import { Order, OrderType } from "~/models/order.models";
import uniqid from 'uniqid';
import Products, { ProductType } from "~/models/products.models";
class UserServices {
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId();
    await databaseServices.users.insertOne(new User({
      _id: user_id,
      ...payload,
      password: hassPassword(payload.password)
    }))
  }
  async loginAdmin(email: string, password: string) {
    const admin = await databaseServices.users.findOne({ email })
    if (!admin) {
      throw new ErrroWithStatus({ message: "Email not found!", status: ErrorStatus.NOT_FOUND })
    }
    if (admin?.role !== "admin") throw new ErrroWithStatus({ message: "You do not have permission to access!", status: ErrorStatus.FORBIDDEN })
    const isPassword = checkPassword(password, admin.password)
    if (!isPassword) {
      throw new ErrroWithStatus({ message: "Password is incoret!", status: ErrorStatus.UNAUTHORIZED })
    }
    const refresh_token = generatorRefreshToken(admin._id.toString())
    await databaseServices.users.updateOne({ _id: admin._id }, { $set: { refresh_token } })
    const data = await databaseServices.users.findOne({ _id: admin._id }, { projection: { _id: 1, firstname: 1, lastname: 1, mobile: 1, email: 1, token: 1, role: 1 } })
    return {
      token: generatorToken(admin._id.toString()),
      refresh_token,
      data
    }
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
  async getAllUser(): Promise<UserType[]> {
    return databaseServices.users.find({}, {
      projection: { password: 0, password_reset_expires: 0, password_reset_token: 0, refresh_token: 0 }
    }).toArray()
  }
  async getUserById(user_id: string): Promise<UserType | null> {
    return databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  }
  async updateUserById(user_id: ObjectId, payload: UpdateInfo) {
    const isCheck = await this.getUserById(user_id.toString());
    if (!isCheck) {
      throw new Error("User not found!")
    }
    return databaseServices.users.findOneAndUpdate({ _id: user_id }, { $set: { ...payload, updated_at: new Date() } }, { returnDocument: "after" })
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
  async getWishList(email: string) {
    const user = await databaseServices.users.findOne({ email })
    if (!user) throw new Error("User not found!")
    const wishlistProductIds = user.wishlist?.map((item: any) => {
      return new ObjectId(item)
    });
    const wishlistProducts = await databaseServices.products.find({ _id: { $in: wishlistProductIds } }).toArray()
    return {
      ...user,
      wishlist: wishlistProducts
    }

  }

  async addCartByUserId(user_id: string, cart: any) {
    const user = await this.getUserById(user_id);
    if (!user) throw new Error("User not found!");

    for (let item of cart) {
      const proc = await databaseServices.products.findOne({ _id: new ObjectId(item._id) });
      if (!proc) {
        throw new Error("Product not found!")
      }
      const colorProc = item.color;
      const totalProc = item.count * proc.price!;
      const amountProc = item.count;
      const isExits = await databaseServices.carts.findOne({ orderby: user_id, product: proc._id, color: new ObjectId(colorProc) })
      if (!isExits) {
        // Cart doesn't exits products and color
        await databaseServices.carts.insertOne(new Carts({
          product: proc._id,
          cartTotal: totalProc,
          amount: amountProc,
          color: new ObjectId(colorProc),
          totalAfterDiscount: 0,
          orderby: user_id
        }));
      }
      else {
        // Nếu sản phẩm đã tồn tại, chỉ cập nhật số lượng
        await databaseServices.carts.updateOne({
          orderby: user_id, product: new ObjectId(item._id), color: new ObjectId(colorProc)
        }
          , { $inc: { amount: amountProc, cartTotal: totalProc } })
      }
    }
    return await databaseServices.carts.find({ orderby: user_id }).toArray();;
  }
  async getUserCart(user_id: string) {
    const carts = await databaseServices.carts.find({ orderby: user_id }).toArray();

    if (!carts) throw new Error("Cart is empty!")
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "orderby",
          foreignField: "_id",
          as: "orderby",
        },
      },
      {
        $unwind: "$orderby",
      },
      {
        $addFields: {
          orderby: "$orderby.email",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $lookup: {
          from: "colors",
          localField: "color",
          foreignField: "_id",
          as: "product.color",
        },
      },
      {
        $addFields: {
          "product.color": {
            $arrayElemAt: ["$product.color.title", 0],
          },
        },
      },
      {
        $project: {
          color: 0, // Loại bỏ trường "createdAt" khỏi kết quả
        },
      },
    ]
    return await databaseServices.carts.aggregate(pipeline).toArray();

  }
  async emptyCart(user_id: string) {
    return await databaseServices.carts.deleteMany({ orderby: user_id })
  }
  async applyCoupon(coupon: string, user_id: string) {

    const couponItem = await databaseServices.coupons.findOne({ name: coupon.toUpperCase() })

    if (couponItem === null) throw new Error("Coupon not found!")

    let cart = await databaseServices.carts.findOne({ orderby: user_id })
    if (!cart) throw new Error("Cart not found!")
    const totalAfterDiscount = ((cart.cartTotal * (100 - couponItem.discount)) / 100).toFixed(2)
    await databaseServices.carts.updateOne({ orderby: user_id }, { $set: { totalAfterDiscount: Number(totalAfterDiscount) } })
    return totalAfterDiscount
  }
  async createOrder(user_id: string, COD: boolean, couponApplied?: string) {
    if (!COD) throw new Error("Create cash order failed!");

    const cartArray = await databaseServices.carts.find({ orderby: user_id }).toArray();
    if (!cartArray || cartArray.length === 0) throw new Error("Cart is empty!");

    const totalBeforeDiscount = cartArray.reduce((acc, item) => acc + item.cartTotal, 0);

    let finalPrice = totalBeforeDiscount;
    if (couponApplied) {
      const coupon = await databaseServices.coupons.findOne({ name: couponApplied?.toUpperCase() });
      if (!coupon || (coupon && coupon?.expire_date < new Date())) {
        throw new Error("Coupon is not found or expired!");
      }
      finalPrice = totalBeforeDiscount - (totalBeforeDiscount * (coupon.discount / 100));
    }

    const orderProducts = cartArray.map((item) => ({
      product: item.product,
      color: item.color,
      count: item.amount,
      price: item.cartTotal,
    }));

    const order = new Order({
      products: orderProducts,
      payment_intent: {
        id: uniqid(),
        amount: finalPrice,
        method: COD ? "COD" : "Credit card",
        currency: "usd", // feature later
        created: new Date(),
      },
      order_status: statusOrder.CASH_ON_DELIVERY,
      orderby: new ObjectId(user_id),
    });

    await databaseServices.order.insertOne(order);

    // update product quantity and sold
    const updatePromises = cartArray.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.amount, sold: +item.amount } },
      },
    }));

    await databaseServices.products.bulkWrite(updatePromises, {});

    return order;
  }

  async getOrder(user_id: string) {
    // const order = await databaseServices.order.findOne({ orderby: user_id });
    // if (!order) throw new Error("Order not found!")
    // const productUser = await databaseServices.carts.findOne({ orderby: user_id })
    // if (!productUser) throw new Error("Cart is empty!")
    // const updatedProducts = await this.getProduct(productUser);
    // return {
    //   ...order,
    //   products: updatedProducts
    // }
  }
  async updateOrderStatus(user_id: string, idCart: string, status: statusOrder): Promise<OrderType> {



    const updatedOrder = await databaseServices.order.findOneAndUpdate(
      { _id: new ObjectId(idCart), orderby: new ObjectId(user_id) },
      { $set: { order_status: status, "payment_intent.status": { status } } },
      { returnDocument: "after" }
    );

    if (updatedOrder && updatedOrder.value) {
      return updatedOrder.value;
    } else {
      throw new Error("Order not found or update failed");
    }
  }
}
export const userServices = new UserServices()