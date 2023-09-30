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
            throw new type_1.ErrroWithStatus({ message: "Email not found!", status: enum_1.ErrorStatus.NOT_FOUND });
        }
        if (admin?.role !== "admin")
            throw new type_1.ErrroWithStatus({ message: "You do not have permission to access!", status: enum_1.ErrorStatus.FORBIDDEN });
        const isPassword = (0, bcrypt_1.checkPassword)(password, admin.password);
        if (!isPassword) {
            throw new type_1.ErrroWithStatus({ message: "Password is incoret!", status: enum_1.ErrorStatus.UNAUTHORIZED });
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
            throw new type_1.ErrroWithStatus({ message: "User not found!", status: enum_1.ErrorStatus.NOT_FOUND });
        }
        const isPassword = (0, bcrypt_1.checkPassword)(password, user.password);
        if (!isPassword) {
            throw new type_1.ErrroWithStatus({ message: "Password is incoret!", status: enum_1.ErrorStatus.UNAUTHORIZED });
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
        const user = await database_services_1.default.users.findOne({ password_reset_token: hashedToken, password_reset_expires: { $gt: new Date() } });
        if (!user)
            throw new Error("Token is invalid or has expired");
        return await database_services_1.default.users.updateOne({ _id: user._id }, { $set: { password: (0, bcrypt_1.hassPassword)(password), password_reset_token: "", password_reset_expires: undefined, updated_at: new Date() } });
    }
    async logout(refresh_token) {
        if (!refresh_token)
            throw new Error("Refresh token not found!");
        return database_services_1.default.users.findOneAndUpdate({ refresh_token }, { $set: { refresh_token: "" } });
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
        const isCheck = await this.getUserById(user_id.toString());
        if (!isCheck) {
            throw new Error("User not found!");
        }
        return database_services_1.default.users.findOneAndUpdate({ _id: user_id }, { $set: { ...payload, updated_at: new Date() } }, { returnDocument: "after" });
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
        return {
            ...user,
            wishlist: wishlistProducts
        };
    }
    async addCartByUserId(user_id, cart) {
        const user = await this.getUserById(user_id);
        if (!user)
            throw new Error("User not found!");
        for (let item of cart) {
            const proc = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(item._id) });
            if (!proc) {
                throw new Error("Product not found!");
            }
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
                    orderby: user_id
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
        let cart = await database_services_1.default.carts.findOne({ orderby: user_id });
        if (!cart)
            throw new Error("Cart not found!");
        const totalAfterDiscount = ((cart.cartTotal * (100 - couponItem.discount)) / 100).toFixed(2);
        await database_services_1.default.carts.updateOne({ orderby: user_id }, { $set: { totalAfterDiscount: Number(totalAfterDiscount) } });
        return totalAfterDiscount;
    }
    async createOrder(user_id, COD, couponApplied) {
        if (!COD)
            throw new Error("Create cash order failed!");
        const cartArray = await database_services_1.default.carts.find({ orderby: user_id }).toArray();
        if (!cartArray || cartArray.length === 0)
            throw new Error("Cart is empty!");
        const totalBeforeDiscount = cartArray.reduce((acc, item) => acc + item.cartTotal, 0);
        let finalPrice = totalBeforeDiscount;
        if (couponApplied) {
            const coupon = await database_services_1.default.coupons.findOne({ name: couponApplied?.toUpperCase() });
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
        const order = new order_models_1.Order({
            products: orderProducts,
            payment_intent: {
                id: (0, uniqid_1.default)(),
                amount: finalPrice,
                method: COD ? "COD" : "Credit card",
                currency: "usd",
                created: new Date(),
            },
            order_status: enum_1.statusOrder.CASH_ON_DELIVERY,
            orderby: new mongodb_1.ObjectId(user_id),
        });
        await database_services_1.default.order.insertOne(order);
        // update product quantity and sold
        const updatePromises = cartArray.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.amount, sold: +item.amount } },
            },
        }));
        await database_services_1.default.products.bulkWrite(updatePromises, {});
        return order;
    }
    async getOrder(user_id) {
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
    async updateOrderStatus(user_id, idCart, status) {
        const updatedOrder = await database_services_1.default.order.findOneAndUpdate({ _id: new mongodb_1.ObjectId(idCart), orderby: new mongodb_1.ObjectId(user_id) }, { $set: { order_status: status, "payment_intent.status": { status } } }, { returnDocument: "after" });
        if (updatedOrder && updatedOrder.value) {
            return updatedOrder.value;
        }
        else {
            throw new Error("Order not found or update failed");
        }
    }
}
exports.userServices = new UserServices();
