import { ObjectId, WithId } from "mongodb";
import { ErrorWithStatus, ProductOrder, RegisterRequestBody, UpdateInfo } from "~/constants/type";
import databaseServices from "./database.services";
import { checkPassword, hassPassword } from "~/utils/bcrypt";
import User, { Address, UserType } from "~/models/users.models";
import { generatorToken } from "~/utils/jwt";
import { ErrorStatus, statusOrder } from "~/constants/enum";
import { generatorRefreshToken } from "~/utils/jwt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { Carts } from "~/models/carts.models";
import { Order, OrderType } from "~/models/order.models";
import axios from "axios";
import uniqid from 'uniqid';
class UserServices {
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId();
    await databaseServices.users.insertOne(new User({
      _id: user_id,
      ...payload,
      password: hassPassword(payload.password)
    }))
    return user_id;
  }
  async loginAdmin(email: string, password: string) {
    const admin = await databaseServices.users.findOne({ email })
    if (!admin) {
      throw new ErrorWithStatus({ message: "Email not found!", status: ErrorStatus.NOT_FOUND })
    }
    if (admin?.role !== "admin") throw new ErrorWithStatus({ message: "You do not have permission to access!", status: ErrorStatus.FORBIDDEN })
    const isPassword = checkPassword(password, admin.password)
    if (!isPassword) {
      throw new ErrorWithStatus({ message: "Password is incoret!", status: ErrorStatus.UNAUTHORIZED })
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
      throw new ErrorWithStatus({ message: "User not found!", status: ErrorStatus.NOT_FOUND, path: "email" })
    }
    const isPassword = checkPassword(password, user.password)
    if (!isPassword) {
      throw new ErrorWithStatus({ message: "Password is incoret!", status: ErrorStatus.BAD_REQUEST, path: "password" })
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
    const user = await databaseServices.users.findOne({
      password_reset_token: hashedToken,
      password_reset_expires: { $gt: new Date() }
    })
    if (!user) throw new Error("Token is invalid or has expired")
    return await databaseServices.users.updateOne({ _id: user._id }, { $set: { password: hassPassword(password), password_reset_token: "", password_reset_expires: undefined, updated_at: new Date() } })
  }
  async logout(id: string) {
    if (!id) throw new Error("User not found!")
    return databaseServices.users.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { refresh_token: "" } })
  }
  async getAllUser() {
    return databaseServices.users.find({}, {
      projection: { password: 0, password_reset_expires: 0, password_reset_token: 0, refresh_token: 0 }
    }).toArray()
  }
  async getUserById(user_id: string) {
    return databaseServices.users.findOne({ _id: new ObjectId(user_id) }, { projection: { password: 0, password_reset_token: 0, password_reset_expires: 0, role: 0 } })
  }
  async updateUserById(user_id: ObjectId, payload: UpdateInfo) {
    const user = await this.getUserById(user_id.toString());
    if (!user) {
      throw new Error("User not found!")
    }
    const arrayAddress = user.address
    if (payload.address) {
      payload.address = { ...payload.address, id: crypto.randomBytes(8).toString("hex") }
      arrayAddress?.push(payload.address)
    }
    return databaseServices.users.findOneAndUpdate({ _id: user_id }, { $set: { ...payload, address: arrayAddress, updated_at: new Date() } }, { returnDocument: "after" })
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
    return wishlistProducts
  }

  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    console.log("🚀 ~ file: users.services.ts:164 ~ UserServices ~ oauth ~ id_token:", id_token)
    const userInfo = await this.getOauthInfoGoogle(access_token, id_token)
    if (!userInfo.verified_email) {
      throw new Error("Email is invalid!")
    }
    console.log("🚀 ~ file: users.services.ts:165 ~ UserServices ~ oauth ~ userInfo:", userInfo)

    const user = await databaseServices.users.findOne({ email: userInfo.email })
    if (user) {
      const refresh_token = generatorRefreshToken(user._id.toString())
      await databaseServices.users.updateOne({ _id: user._id }, { $set: { refresh_token } })

      return {
        token: generatorToken(user._id.toString()),
        refresh_token
      }
    }
    else {
      const firstname = userInfo.name.split(' ').pop() || ""
      const lastname = userInfo.name.split(' ').slice(0, -1).join(' ')
      const password = Math.random().toString().substring(2, 15);
      const body: RegisterRequestBody = {
        email: userInfo.email,
        firstname,
        lastname,
        password
      }
      const newUser_id = this.register(body)
      const refresh_token = generatorRefreshToken(newUser_id.toString())
      await databaseServices.users.updateOne({ _id: newUser_id }, {
        $set: {
          refresh_token,
          avatar: { url: userInfo.picture, asset_id: "", public_id: "" }
        }
      })

      return {
        token: generatorToken(newUser_id.toString()),
        refresh_token
      }
    }


  }
  private async getOauthInfoGoogle(access_token: string, id_token: string) {
    const { data } = await
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
        params: {
          access_token,
          alt: "json"
        },
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      })
    return data as {
      id: string,
      email: string,
      name: string,
      given_name: string,
      family_name: string,
      picture: string,
      verified_email: boolean
    }
  }
  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code", // get access token
      access_type: "offline" // get refresh token. if online -> not get refresh token
    }
    const { data } = await axios.post("https://oauth2.googleapis.com/token", body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    return data as {
      id_token: string, access_token: string
    };

  }
  async addCartByUserId(user_id: string, cart: any) {
    const user = await this.getUserById(user_id);
    if (!user) throw new Error("User not found!");
    const address = cart[0].address;
    console.log("🚀 ~ file: users.services.ts:157 ~ UserServices ~ addCartByUserId ~ address:", address)
    for (let item of cart) {
      const proc = await databaseServices.products.findOne({
        _id: new ObjectId(item._id),
      })
      if (!proc) {
        throw new Error("Product not found !")
      }
      if (proc.quantity && proc.quantity < item.count) throw new Error("Product is out of stock!")
      const isColor = proc.color?.find((color) => color.toString() === item.color)
      if (isColor == undefined) throw new Error("Color is invalid!")
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
          orderby: user_id,
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
        $match: {
          orderby: user_id,
        },
      },
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

    let cartWithCoupon = await databaseServices.carts.findOne({ orderby: user_id, coupon })
    if (cartWithCoupon) throw new Error("Coupon already applied!")
    let cart = await databaseServices.carts.findOne({ orderby: user_id })
    if (!cart) throw new Error("Cart not found!")


    let totalAfterDiscount = ((cart.cartTotal - couponItem.discount)) > 0 ? ((cart.cartTotal - couponItem.discount)).toFixed(2) : 1
    await databaseServices.carts.updateOne({ orderby: user_id }, { $set: { totalAfterDiscount: Number(totalAfterDiscount), coupon } })
    return totalAfterDiscount
  }
  // async createOrder(user_id: string, COD: boolean, couponApplied?: string) {
  //   if (!COD) throw new Error("Create   //   const order = new Order({
  //     products: orderProducts,
  //     payment_intent: {
  //       id: uniqid(),
  //       amount: finalPrice,
  //       method: COD ? "COD" : "Credit card",
  //       currency: "usd", // feature later
  //       created: new Date(),
  //     },
  //     order_status: statusOrder.CASH_ON_DELIVERY,
  //     orderby: new ObjectId(user_id),
  //   });

  //   await databaseServices.order.insertOne(order);

  //   // update product quantity and sold
  //   const updatePromises = cartArray.map((item) => ({
  //     updateOne: {
  //       filter: { _id: item.product },
  //       update: { $inc: { quantity: -item.amount, sold: +item.amount } },
  //     },
  //   }));

  //   await databaseServices.products.bulkWrite(updatePromises, {});

  //   return order;
  // }

  async createOrder(user_id: string, COD: boolean, couponApplied?: string, payment_id?: string, address?: Address) {

    if (!COD && !payment_id) {
      throw new Error("Create cash order failed!");
    }

    const cartArray = await databaseServices.carts.find({ orderby: user_id }).toArray();
    if (!cartArray || cartArray.length === 0) {
      throw new Error("Cart is empty!");
    }

    const totalBeforeDiscount = cartArray.reduce((acc, item) => acc + item.cartTotal, 0);

    let finalPrice = totalBeforeDiscount;
    if (couponApplied) {
      const coupon = await databaseServices.coupons.findOne({ name: couponApplied?.toUpperCase() });
      if (!coupon || (coupon && coupon?.expire_date < new Date())) {
        throw new Error("Coupon is not found or expired!");
      }
      finalPrice = totalBeforeDiscount - coupon.discount > 0 ? totalBeforeDiscount - coupon.discount : 1;
    }

    const orderProducts = [];
    const updatePromises = [];

    for (const item of cartArray) {
      const product = await databaseServices.products.findOne({ _id: item.product });
      if (!product?.quantity) throw new Error("Product not found!");
      if (product.quantity < item.amount) {
        throw new Error(`Not enough quantity available for ${product.title}`);
      }
      const quantityToSubtract = Math.min(item.amount, product.quantity);

      orderProducts.push({
        product: item.product,
        color: item.color,
        count: quantityToSubtract,
        price: item.cartTotal,

      });

      updatePromises.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { quantity: -quantityToSubtract, sold: +quantityToSubtract } },
        },
      });
    }

    await databaseServices.products.bulkWrite(updatePromises, {});

    const order = new Order({
      products: orderProducts,
      payment_intent: {
        id: uniqid(),
        amount: finalPrice,
        method: COD ? "COD" : "Credit card",
        currency: "usd", // feature later
        created: new Date(),
        couponApplied: couponApplied !== "" ? true : false,
      },
      order_status: statusOrder.CASH_ON_DELIVERY,
      payment_id: payment_id,
      orderby: new ObjectId(user_id),
      address: address as Address
    });
    await databaseServices.carts.deleteMany({ orderby: user_id });
    await databaseServices.order.insertOne(order);

    return order;

  }

  async getOrder(user_id: string, order_id: string) {
    const orders = await databaseServices.order.findOne({ orderby: new ObjectId(user_id), _id: new ObjectId(order_id) })
    if (!orders) throw new Error("Order not found!")
    const updatedProducts = await Promise.all(orders.products.map(async (item) => {
      const product = await databaseServices.products.findOne({ _id: new ObjectId(item.product as string) });
      const color = await databaseServices.colors.findOne({ _id: new ObjectId(item.color) })
      return {
        ...item,
        product: product,
        color: color?.title
      };
    }));

    return {
      ...orders,
      products: updatedProducts
    };
  }
  async updateCartQuantity(amount: number, user_id: string, cart_id: string) {
    const cart = await databaseServices.carts.findOne({ orderby: user_id, _id: new ObjectId(cart_id) })
    if (!cart) throw new Error("Cart not found!")
    const proc = await databaseServices.products.findOne({ _id: cart.product })
    if (!proc) throw new Error("Product not found!")
    if (amount < 1 && amount > proc.quantity!) {
      throw new Error("Amount is invalid")
    }
    return await databaseServices.carts.updateOne({ orderby: user_id, _id: new ObjectId(cart_id) }, { $set: { amount, cartTotal: amount * proc.price! } })
  }
  async deleteCart(user_id: string, cart_id: string) {
    return await databaseServices.carts.deleteOne({ orderby: user_id, _id: new ObjectId(cart_id) })
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
  async getOrderByUser(id: string) {
    return await databaseServices.order.find({ orderby: new ObjectId(id) }).toArray()
  }
  async getInfoByToken(id: string) {
    return await databaseServices.users.findOne({ _id: new ObjectId(id) }, {
      projection: { password: 0, password_reset_token: 0, password_reset_expires: 0, role: 0 }
    })
  }
  async updateAddressUser(id_address: string, id_user: string, body: Address) {

    const user = await databaseServices.users.findOne({
      _id: new ObjectId(id_user),
    }, { projection: { password: 0 } })
    if (!user) throw new Error("User not found!")

    const address = user.address?.find((item) => item.id === id_address)
    if (!address) throw new Error("Address not found!")
    const newAddress = { ...address, ...body }
    const index = user.address?.findIndex((item) => item.id === id_address)
    console.log("🚀 ~ file: users.services.ts:429 ~ UserServices ~ updateAddressUser ~ index:", index)
    user.address?.splice(index!, 1, newAddress)
    console.log(user.address)
    return await databaseServices.users.findOneAndUpdate({ _id: new ObjectId(id_user) }, { $set: { address: user.address } }, { returnDocument: "after" })
  }
  async deleteAddressUser(id_user: string, id_address: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(id_user) })

    if (!user) throw new Error("User not found!");
    if (!user.address || user.address.length === 0) {
      throw new Error("You don't have an address yet")
    }
    const address = user.address?.find((item) => item.id === id_address)
    if (!address) throw new Error("Address not found!");
    const newAddress = user.address.filter((item) => item.id !== id_address)
    return await databaseServices.users.findOneAndUpdate({ _id: new ObjectId(id_user) }, { $set: { address: newAddress } }, { returnDocument: "after" })
  }
}
export const userServices = new UserServices()