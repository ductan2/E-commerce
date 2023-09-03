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
import { ProductType } from "~/models/products.models";
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
    if (admin?.role !== "admin") throw new ErrroWithStatus({ message: "You do not have permission to access!", status: ErrorStatus.NOT_FOUND })
    if (!admin) {
      throw new ErrroWithStatus({ message: "You do not have permission to access!", status: ErrorStatus.NOT_FOUND })
    }
    const isPassword = checkPassword(password, admin.password)
    if (!isPassword) {
      throw new ErrroWithStatus({ message: "Password is incoret!", status: ErrorStatus.UNAUTHORIZED })
    }
    const refresh_token = generatorRefreshToken(admin._id.toString())
    await databaseServices.users.updateOne({ _id: admin._id }, { $set: { refresh_token } })

    return {
      token: generatorToken(admin._id.toString()),
      refresh_token
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
    return databaseServices.users.find().toArray()
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
  async userCart(user_id: string, cart: any) {
    let products = [];
    const user = await this.getUserById(user_id);
    if (!user) throw new Error("User not found!")
    await databaseServices.carts.findOneAndDelete({ orderby: user_id })
    for (let item of cart) {
      let object: any = {};
      object.product = item._id;
      object.count = item.count;
      object.color = item.color;
      let getPrice = await databaseServices.products.find(
        { _id: new ObjectId(item._id) },
        { projection: { price: 1, _id: 0 } } // Chỉ lấy trường "price"
      ).toArray();
      object.price = Number(getPrice[0].price);
      products.push(object)
    }
    let cartTotal = 0;
    for (let item of products) {
      cartTotal += item.count * item.price
    }
    await databaseServices.carts.insertOne(new Carts({
      products: products, cartTotal, orderby: user_id
    }))
    return await databaseServices.carts.findOne({ orderby: user_id })
  }
  async getProduct(productUser: CartType): Promise<ProductOrder[]> {
    const updatedProducts: ProductOrder[] = [];
    for (const product of productUser.products) {
      const foundProduct: WithId<ProductType> | null = await databaseServices.products.findOne({ _id: new ObjectId(product.product) }
        , { projection: { quantity: 1, title: 1, _id: 1 } });
      if (foundProduct) {
        const updatedProduct = {
          ...product,
          product: foundProduct // Thay thế ID sản phẩm bằng dữ liệu sản phẩm
        };
        updatedProducts.push(updatedProduct);
      }
    }
    return updatedProducts
  }
  async getUserCart(user_id: string) {
    const productUser = await databaseServices.carts.findOne({ orderby: user_id })
    if (!productUser) throw new Error("Cart is empty!")
    const updatedProducts = await this.getProduct(productUser);
    return {
      ...productUser,
      products: updatedProducts
    }
  }
  async emptyCart(user_id: string) {
    return await databaseServices.carts.deleteOne({ orderby: user_id })
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
  async createOrder(user_id: string, COD: boolean, couponApplied: boolean) {
    if (!COD) throw new Error("Create cash order failed!")
    const userCart = await databaseServices.carts.findOne({ orderby: user_id })
    if (!userCart) throw new Error("Cart not found!")
    let finalAmount = couponApplied ? userCart.totalAfterDiscount : userCart.cartTotal;
    await databaseServices.order.insertOne(new Order({
      products: userCart.products, payment_intent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: statusOrder.CASH_ON_DELIVERY,
        created: new Date(),
        currency: "usd",
      }, order_status: statusOrder.CASH_ON_DELIVERY, orderby: user_id
    }))
    let update = userCart.products.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item.product) },
        update: { $inc: { quantity: -item.count, sold: +item.count } }
      }
    }));
    const updated = await databaseServices.products.bulkWrite(update, {})
    return updated
  }
  async getOrder(user_id: string) {
    const order = await databaseServices.order.findOne({ orderby: user_id });
    if (!order) throw new Error("Order not found!")
    const productUser = await databaseServices.carts.findOne({ orderby: user_id })
    if (!productUser) throw new Error("Cart is empty!")
    const updatedProducts = await this.getProduct(productUser);
    return {
      ...order,
      products: updatedProducts
    }
  }
  async updateOrderStatus(user_id: string, id_order: string, status: statusOrder): Promise<OrderType> {
    const updatedOrder = await databaseServices.order.findOneAndUpdate(
      { _id: new ObjectId(id_order), orderby: user_id },
      { $set: { order_status: status, payment_intent: { status: status } } },
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