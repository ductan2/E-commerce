"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
const database_services_1 = __importDefault(require("./database.services"));
const bcrypt_1 = require("../utils/bcrypt");
const users_models_1 = __importDefault(require("../models/users.models"));
const jwt_1 = require("../utils/jwt");
const enum_1 = require("../constants/enum");
const jwt_2 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const carts_models_1 = require("../models/carts.models");
const order_models_1 = require("../models/order.models");
const uniqid_1 = __importDefault(require("uniqid"));
class UserServices {
    async register(payload) {
        const user_id = new mongodb_1.ObjectId();
        await database_services_1.default.users.insertOne(new users_models_1.default({
            _id: user_id,
            ...payload,
            password: (0, bcrypt_1.hassPassword)(payload.password)
        }));
    }
    async loginAdmin(email, password) {
        const admin = await database_services_1.default.users.findOne({ email });
        if (!admin) {
            throw new type_1.ErrorWithStatus({ message: "Email not found!", status: enum_1.ErrorStatus.NOT_FOUND });
        }
        if (admin?.role !== "admin")
            throw new type_1.ErrorWithStatus({ message: "You do not have permission to access!", status: enum_1.ErrorStatus.FORBIDDEN });
        const isPassword = (0, bcrypt_1.checkPassword)(password, admin.password);
        if (!isPassword) {
            throw new type_1.ErrorWithStatus({ message: "Password is incoret!", status: enum_1.ErrorStatus.UNAUTHORIZED });
        }
        const refresh_token = (0, jwt_2.generatorRefreshToken)(admin._id.toString());
        await database_services_1.default.users.updateOne({ _id: admin._id }, { $set: { refresh_token } });
        const data = await database_services_1.default.users.findOne({ _id: admin._id }, { projection: { _id: 1, firstname: 1, lastname: 1, mobile: 1, email: 1, token: 1, role: 1 } });
        return {
            token: (0, jwt_1.generatorToken)(admin._id.toString()),
            refresh_token,
            data
        };
    }
    async login(email, password) {
        const user = await database_services_1.default.users.findOne({ email });
        if (!user) {
            throw new type_1.ErrorWithStatus({ message: "User not found!", status: enum_1.ErrorStatus.NOT_FOUND, path: "email" });
        }
        const isPassword = (0, bcrypt_1.checkPassword)(password, user.password);
        if (!isPassword) {
            throw new type_1.ErrorWithStatus({ message: "Password is incoret!", status: enum_1.ErrorStatus.BAD_REQUEST, path: "password" });
        }
        const refresh_token = (0, jwt_2.generatorRefreshToken)(user._id.toString());
        await database_services_1.default.users.updateOne({ _id: user._id }, { $set: { refresh_token } });
        return {
            token: (0, jwt_1.generatorToken)(user._id.toString()),
            refresh_token
        };
    }
    async refreshToken(refresh_token) {
        let accessToken;
        if (!refresh_token)
            throw new Error("Refresh token not found!");
        const user = await database_services_1.default.users.findOne({ refresh_token });
        if (!user)
            throw new Error("User not found!");
        jsonwebtoken_1.default.verify(refresh_token, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user._id.toString() !== decoded?.id)
                throw new Error("Refresh token is invalid!");
            accessToken = (0, jwt_1.generatorToken)(user._id.toString());
        });
        return accessToken;
    }
    async resetPassword(token, password) {
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const user = await database_services_1.default.users.findOne({
            password_reset_token: hashedToken,
            password_reset_expires: { $gt: new Date() }
        });
        if (!user)
            throw new Error("Token is invalid or has expired");
        return await database_services_1.default.users.updateOne({ _id: user._id }, { $set: { password: (0, bcrypt_1.hassPassword)(password), password_reset_token: "", password_reset_expires: undefined, updated_at: new Date() } });
    }
    async logout(id) {
        if (!id)
            throw new Error("User not found!");
        return database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { refresh_token: "" } });
    }
    async getAllUser() {
        return database_services_1.default.users.find({}, {
            projection: { password: 0, password_reset_expires: 0, password_reset_token: 0, refresh_token: 0 }
        }).toArray();
    }
    async getUserById(user_id) {
        return database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(user_id) });
    }
    async updateUserById(user_id, payload) {
        const user = await this.getUserById(user_id.toString());
        if (!user) {
            throw new Error("User not found!");
        }
        const arrayAddress = user.address;
        if (payload.address) {
            payload.address = { ...payload.address, id: crypto_1.default.randomBytes(8).toString("hex") };
            arrayAddress?.push(payload.address);
        }
        return database_services_1.default.users.findOneAndUpdate({ _id: user_id }, { $set: { ...payload, address: arrayAddress, updated_at: new Date() } }, { returnDocument: "after" });
    }
    async deleteUserById(user_id) {
        const isCheck = await this.getUserById(user_id);
        if (isCheck) {
            return database_services_1.default.users.deleteOne({ _id: new mongodb_1.ObjectId(user_id) });
        }
        else {
            return null;
        }
    }
    async blockUser(user_id) {
        const isCheck = await this.getUserById(user_id);
        if (isCheck) {
            if (isCheck.blocked)
                throw new Error("User is blocked!");
            return database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, { $set: { blocked: true } });
        }
        else {
            throw new Error("User not found!");
        }
    }
    async unBlockUser(user_id) {
        const isCheck = await this.getUserById(user_id);
        if (isCheck) {
            if (!isCheck.blocked)
                throw new Error("User has not been blocked");
            return database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(user_id) }, { $set: { blocked: false } }, { returnDocument: "after" });
        }
        else {
            throw new Error("User not found!");
        }
    }
    async updatePassword(user_id, oldPassword, newPassword) {
        const user = await this.getUserById(user_id);
        if (!user) {
            throw new Error("User not found!");
        }
        const isPassword = (0, bcrypt_1.checkPassword)(oldPassword, user.password);
        if (!isPassword)
            throw new Error("Password is incoret!");
        return database_services_1.default.users.updateOne({ _id: new mongodb_1.ObjectId(user_id) }, { $set: { password: (0, bcrypt_1.hassPassword)(newPassword), updated_at: new Date() } });
    }
    async forgotPasswordToken(email) {
        const user = await database_services_1.default.users.findOne({ email });
        if (!user)
            throw new Error("User not found!");
        const UserCl = new users_models_1.default(user);
        const { resetToken, password_reset_expires, password_reset_token } = await UserCl.createPasswordResetToken();
        await database_services_1.default.users.updateOne({ _id: user._id }, { $set: { password_reset_token, password_reset_expires, updated_at: new Date() } });
        return resetToken;
    }
    async getWishList(email) {
        const user = await database_services_1.default.users.findOne({ email });
        if (!user)
            throw new Error("User not found!");
        const wishlistProductIds = user.wishlist?.map((item) => {
            return new mongodb_1.ObjectId(item);
        });
        const wishlistProducts = await database_services_1.default.products.find({ _id: { $in: wishlistProductIds } }).toArray();
        return wishlistProducts;
    }
    async addCartByUserId(user_id, cart) {
        const user = await this.getUserById(user_id);
        if (!user)
            throw new Error("User not found!");
        const address = cart[0].address;
        console.log("🚀 ~ file: users.services.ts:157 ~ UserServices ~ addCartByUserId ~ address:", address);
        for (let item of cart) {
            const proc = await database_services_1.default.products.findOne({
                _id: new mongodb_1.ObjectId(item._id),
            });
            if (!proc) {
                throw new Error("Product not found !");
            }
            if (proc.quantity && proc.quantity < item.count)
                throw new Error("Product is out of stock!");
            const isColor = proc.color?.find((color) => color.toString() === item.color);
            if (isColor == undefined)
                throw new Error("Color is invalid!");
            const colorProc = item.color;
            const totalProc = item.count * proc.price;
            const amountProc = item.count;
            const isExits = await database_services_1.default.carts.findOne({ orderby: user_id, product: proc._id, color: new mongodb_1.ObjectId(colorProc) });
            if (!isExits) {
                // Cart doesn't exits products and color
                await database_services_1.default.carts.insertOne(new carts_models_1.Carts({
                    product: proc._id,
                    cartTotal: totalProc,
                    amount: amountProc,
                    color: new mongodb_1.ObjectId(colorProc),
                    totalAfterDiscount: 0,
                    orderby: user_id,
                }));
            }
            else {
                // Nếu sản phẩm đã tồn tại, chỉ cập nhật số lượng
                await database_services_1.default.carts.updateOne({
                    orderby: user_id, product: new mongodb_1.ObjectId(item._id), color: new mongodb_1.ObjectId(colorProc)
                }, { $inc: { amount: amountProc, cartTotal: totalProc } });
            }
        }
        return await database_services_1.default.carts.find({ orderby: user_id }).toArray();
        ;
    }
    async getUserCart(user_id) {
        const carts = await database_services_1.default.carts.find({ orderby: user_id }).toArray();
        if (!carts)
            throw new Error("Cart is empty!");
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
        ];
        return await database_services_1.default.carts.aggregate(pipeline).toArray();
    }
    async emptyCart(user_id) {
        return await database_services_1.default.carts.deleteMany({ orderby: user_id });
    }
    async applyCoupon(coupon, user_id) {
        const couponItem = await database_services_1.default.coupons.findOne({ name: coupon.toUpperCase() });
        if (couponItem === null)
            throw new Error("Coupon not found!");
        let cartWithCoupon = await database_services_1.default.carts.findOne({ orderby: user_id, coupon });
        if (cartWithCoupon)
            throw new Error("Coupon already applied!");
        let cart = await database_services_1.default.carts.findOne({ orderby: user_id });
        if (!cart)
            throw new Error("Cart not found!");
        let totalAfterDiscount = ((cart.cartTotal - couponItem.discount)) > 0 ? ((cart.cartTotal - couponItem.discount)).toFixed(2) : 1;
        await database_services_1.default.carts.updateOne({ orderby: user_id }, { $set: { totalAfterDiscount: Number(totalAfterDiscount), coupon } });
        return totalAfterDiscount;
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
    async createOrder(user_id, COD, couponApplied, payment_id, address) {
        if (!COD && !payment_id) {
            throw new Error("Create cash order failed!");
        }
        const cartArray = await database_services_1.default.carts.find({ orderby: user_id }).toArray();
        if (!cartArray || cartArray.length === 0) {
            throw new Error("Cart is empty!");
        }
        const totalBeforeDiscount = cartArray.reduce((acc, item) => acc + item.cartTotal, 0);
        let finalPrice = totalBeforeDiscount;
        if (couponApplied) {
            const coupon = await database_services_1.default.coupons.findOne({ name: couponApplied?.toUpperCase() });
            if (!coupon || (coupon && coupon?.expire_date < new Date())) {
                throw new Error("Coupon is not found or expired!");
            }
            finalPrice = totalBeforeDiscount - coupon.discount > 0 ? totalBeforeDiscount - coupon.discount : 1;
        }
        const orderProducts = [];
        const updatePromises = [];
        for (const item of cartArray) {
            const product = await database_services_1.default.products.findOne({ _id: item.product });
            if (!product?.quantity)
                throw new Error("Product not found!");
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
        await database_services_1.default.products.bulkWrite(updatePromises, {});
        const order = new order_models_1.Order({
            products: orderProducts,
            payment_intent: {
                id: (0, uniqid_1.default)(),
                amount: finalPrice,
                method: COD ? "COD" : "Credit card",
                currency: "usd",
                created: new Date(),
                couponApplied: couponApplied !== "" ? true : false,
            },
            order_status: enum_1.statusOrder.CASH_ON_DELIVERY,
            payment_id: payment_id,
            orderby: new mongodb_1.ObjectId(user_id),
            address: address
        });
        await database_services_1.default.carts.deleteMany({ orderby: user_id });
        await database_services_1.default.order.insertOne(order);
        return order;
    }
    async getOrder(user_id, order_id) {
        const orders = await database_services_1.default.order.findOne({ orderby: new mongodb_1.ObjectId(user_id), _id: new mongodb_1.ObjectId(order_id) });
        if (!orders)
            throw new Error("Order not found!");
        const updatedProducts = await Promise.all(orders.products.map(async (item) => {
            const product = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(item.product) });
            const color = await database_services_1.default.colors.findOne({ _id: new mongodb_1.ObjectId(item.color) });
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
    async updateCartQuantity(amount, user_id, cart_id) {
        const cart = await database_services_1.default.carts.findOne({ orderby: user_id, _id: new mongodb_1.ObjectId(cart_id) });
        if (!cart)
            throw new Error("Cart not found!");
        const proc = await database_services_1.default.products.findOne({ _id: cart.product });
        if (!proc)
            throw new Error("Product not found!");
        if (amount < 1 && amount > proc.quantity) {
            throw new Error("Amount is invalid");
        }
        return await database_services_1.default.carts.updateOne({ orderby: user_id, _id: new mongodb_1.ObjectId(cart_id) }, { $set: { amount, cartTotal: amount * proc.price } });
    }
    async deleteCart(user_id, cart_id) {
        return await database_services_1.default.carts.deleteOne({ orderby: user_id, _id: new mongodb_1.ObjectId(cart_id) });
    }
    async updateOrderStatus(user_id, idCart, status) {
        const updatedOrder = await database_services_1.default.order.findOneAndUpdate({ _id: new mongodb_1.ObjectId(idCart), orderby: new mongodb_1.ObjectId(user_id) }, { $set: { order_status: status, "payment_intent.status": { status } } }, { returnDocument: "after" });
        if (updatedOrder && updatedOrder.value) {
            return updatedOrder.value;
        }
        else {
            throw new Error("Order not found or update failed");
        }
    }
    async getOrderByUser(id) {
        return await database_services_1.default.order.find({ orderby: new mongodb_1.ObjectId(id) }).toArray();
    }
    async getInfoByToken(id) {
        return await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    async updateAddressUser(id_address, id_user, body) {
        console.log("🚀 ~ file: users.services.ts:420 ~ UserServices ~ updateAddressUser ~ body:", body);
        const user = await database_services_1.default.users.findOne({
            _id: new mongodb_1.ObjectId(id_user),
        });
        if (!user)
            throw new Error("User not found!");
        const address = user.address?.find((item) => item.id === id_address);
        if (!address)
            throw new Error("Address not found!");
        const newAddress = { ...address, ...body };
        const index = user.address?.findIndex((item) => item.id === id_address);
        console.log("🚀 ~ file: users.services.ts:429 ~ UserServices ~ updateAddressUser ~ index:", index);
        user.address?.splice(index, 1, newAddress);
        console.log(user.address);
        return await database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_user) }, { $set: { address: user.address } }, { returnDocument: "after" });
    }
    async deleteAddressUser(id_user, id_address) {
        const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(id_user) });
        if (!user)
            throw new Error("User not found!");
        if (!user.address || user.address.length === 0) {
            throw new Error("You don't have an address yet");
        }
        const address = user.address?.find((item) => item.id === id_address);
        if (!address)
            throw new Error("Address not found!");
        const newAddress = user.address.filter((item) => item.id !== id_address);
        return await database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_user) }, { $set: { address: newAddress } }, { returnDocument: "after" });
    }
}
exports.userServices = new UserServices();
