"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusController = exports.updateCartQuantityController = exports.getOrderController = exports.getOrderByUserController = exports.createOrderController = exports.deleteCartController = exports.getUserCartController = exports.deleteAddressUserController = exports.updateAddressUserController = exports.userAddCartController = exports.getWishListController = exports.logoutController = exports.updatePasswordController = exports.refreshTokenController = exports.unBlockUserController = exports.blockUserController = exports.deleteUserController = exports.updateUserController = exports.applyCouponController = exports.getEmptyCartController = exports.getUserController = exports.getAllUserController = exports.resetPasswordController = exports.forgotPasswordTokenController = exports.getInfoTokenController = exports.loginAdminController = exports.loginController = exports.registerController = void 0;
const enum_1 = require("../constants/enum");
const users_services_1 = require("../services/users.services");
const email_controller_1 = require("./email.controller");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const registerController = async (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body;
    try {
        await users_services_1.userServices.register({ firstname, lastname, email, mobile, password });
        return res.status(201).json({ message: "Register successfully", status: 201 });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ error: error.message || "Register failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await users_services_1.userServices.login(email, password);
        res.cookie('refresh_token', result.refresh_token, { httpOnly: true, maxAge: 60 * 1000 }); // 3 days = 72 * 60 * 60 * 1000
        return res.status(200).json({ message: "Login successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json([{ error: error.message || "Login failed", status: enum_1.ErrorStatus.INTERNAL_SERVER, path: error.path }]);
    }
};
exports.loginController = loginController;
const loginAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await users_services_1.userServices.loginAdmin(email, password);
        res.cookie('refresh_token', result.refresh_token, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
        return res.status(200).json({ message: "Login successfully", status: 200, result: { ...result.data, token: result.token } });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ error: error.message || "Login failed", status: error.status || enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.loginAdminController = loginAdminController;
const getInfoTokenController = async (req, res) => {
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.getInfoByToken(_id);
        return res.status(200).json({ message: "Get info token successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ error: error.message || "Login failed", status: error.status || enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.getInfoTokenController = getInfoTokenController;
const forgotPasswordTokenController = async (req, res) => {
    try {
        const { email } = req.body;
        const token = await users_services_1.userServices.forgotPasswordToken(email);
        const resetUrl = `Hi ${email}, please click this link to reset your password:
     <a href="${process.env.HOST_FRONTEND}/${token}">Reset password</a>`;
        const data = {
            to: email,
            text: `Hey ${email}`,
            subject: "Reset password",
            html: resetUrl
        };
        (0, email_controller_1.sendEmail)(data, req, res);
        return res.status(200).json({ message: "Send forgot password token successfully", status: 200, token });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Send forgot password token failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.forgotPasswordTokenController = forgotPasswordTokenController;
const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const result = await users_services_1.userServices.resetPassword(token, password);
        return res.status(200).json({ message: "Reset password successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Reset password failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.resetPasswordController = resetPasswordController;
const getAllUserController = async (req, res) => {
    try {
        const result = await users_services_1.userServices.getAllUser();
        return res.status(200).json({ message: "Get user successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.FORBIDDEN).json({ error: error.message || "Get user failed", status: enum_1.ErrorStatus.FORBIDDEN });
    }
};
exports.getAllUserController = getAllUserController;
const getUserController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await users_services_1.userServices.getUserById(id);
        if (result === null) {
            return res.status(enum_1.ErrorStatus.NOT_FOUND).json({ message: "User not found!", status: enum_1.ErrorStatus.NOT_FOUND });
        }
        return res.status(200).json({ message: "Get user successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.FORBIDDEN).json({ error: error.message || "Get user failed", status: enum_1.ErrorStatus.FORBIDDEN });
    }
};
exports.getUserController = getUserController;
const getEmptyCartController = async (req, res) => {
    const { _id } = req.user;
    try {
        const result = await users_services_1.userServices.emptyCart(_id);
        return res.status(200).json({ message: "Empty cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Empty cart failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.getEmptyCartController = getEmptyCartController;
const applyCouponController = async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    try {
        const result = await users_services_1.userServices.applyCoupon(coupon, _id);
        return res.status(200).json({ message: "Apply coupon successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Apply coupon failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.applyCouponController = applyCouponController;
const updateUserController = async (req, res) => {
    const { _id } = req.user;
    console.log("🚀 ~ file: users.controller.ts:123 ~ updateUserController ~ _id:", _id);
    console.log(req.body);
    try {
        const { value } = await users_services_1.userServices.updateUserById(_id, req.body);
        return res.status(200).json({ message: "Update user successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Update user failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
    }
};
exports.updateUserController = updateUserController;
const deleteUserController = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await users_services_1.userServices.deleteUserById(id);
        if (result === null) {
            return res.status(enum_1.ErrorStatus.NOT_FOUND).json({ message: "User not found!", status: enum_1.ErrorStatus.NOT_FOUND });
        }
        return res.status(200).json({ message: "Delete user successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Delete user failed", status: enum_1.ErrorStatus.INTERNAL_SERVER, error: error.message });
    }
};
exports.deleteUserController = deleteUserController;
const blockUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await users_services_1.userServices.blockUser(id);
        return res.status(200).json({ message: "Block user successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Block user failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
    }
};
exports.blockUserController = blockUserController;
const unBlockUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await users_services_1.userServices.unBlockUser(id);
        return res.status(200).json({ message: "Unblock user successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Unblock user failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
    }
};
exports.unBlockUserController = unBlockUserController;
const refreshTokenController = async (req, res) => {
    try {
        const cookie = req.cookies;
        const result = await users_services_1.userServices.refreshToken(cookie.refresh_token);
        return res.status(200).json({ message: "Refresh token successfully", status: 200, access_token: result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Refresh token failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.refreshTokenController = refreshTokenController;
const updatePasswordController = async (req, res) => {
    try {
        const { _id } = req.user;
        const { oldPassword, newPassword } = req.body;
        const result = await users_services_1.userServices.updatePassword(_id, oldPassword, newPassword);
        return res.status(200).json({ message: "Update password successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Update password failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.updatePasswordController = updatePasswordController;
const logoutController = async (req, res) => {
    try {
        const { _id } = req.user;
        await users_services_1.userServices.logout(_id);
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204);
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.FORBIDDEN).json({ error: error.message || "Logout failed", status: enum_1.ErrorStatus.FORBIDDEN });
    }
};
exports.logoutController = logoutController;
const getWishListController = async (req, res) => {
    try {
        const result = await users_services_1.userServices.getWishList(req.user.email);
        return res.status(200).json({ message: "Get wishlist successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get wishlist failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.getWishListController = getWishListController;
const userAddCartController = async (req, res) => {
    try {
        const { cart } = req.body;
        const { _id } = req.user;
        const result = await users_services_1.userServices.addCartByUserId(_id, cart);
        return res.status(200).json({ message: "Get cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get cart failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.userAddCartController = userAddCartController;
const updateAddressUserController = async (req, res) => {
    try {
        const { id_address } = req.params;
        const { _id } = req.user;
        const { address } = req.body;
        const { value } = await users_services_1.userServices.updateAddressUser(id_address, _id, address[0]);
        return res.status(200).json({ message: "Update address successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Update address user failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.updateAddressUserController = updateAddressUserController;
const deleteAddressUserController = async (req, res) => {
    try {
        const { _id } = req.user;
        const { id_address } = req.params;
        const { value } = await users_services_1.userServices.deleteAddressUser(_id, id_address);
        return res.status(200).json({ message: "Delete address successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Delete address user failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.deleteAddressUserController = deleteAddressUserController;
const getUserCartController = async (req, res) => {
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.getUserCart(_id);
        return res.status(200).json({ message: "Get cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get cart failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.getUserCartController = getUserCartController;
const deleteCartController = async (req, res) => {
    try {
        const { _id: user_id } = req.user;
        const { cart_id } = req.params;
        const result = await users_services_1.userServices.deleteCart(user_id, cart_id);
        return res.status(200).json({ message: "Get cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get cart failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.deleteCartController = deleteCartController;
const createOrderController = async (req, res) => {
    const { COD, couponApplied, payment_id, address } = req.body;
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.createOrder(_id, COD, couponApplied, payment_id, address);
        return res.status(200).json({ message: "Create order successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Create order failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.createOrderController = createOrderController;
const getOrderByUserController = async (req, res) => {
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.getOrderByUser(_id);
        return res.status(200).json({ message: "Get order successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get order failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.getOrderByUserController = getOrderByUserController;
const getOrderController = async (req, res) => {
    try {
        const { _id } = req.user;
        const { order_id } = req.params;
        const result = await users_services_1.userServices.getOrder(_id, order_id);
        return res.status(200).json({ message: "Get order successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Get order failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.getOrderController = getOrderController;
const updateCartQuantityController = async (req, res) => {
    try {
        const { cart_id } = req.params;
        const { _id: user_id } = req.user;
        const { amount } = req.body;
        const result = await users_services_1.userServices.updateCartQuantity(amount, user_id, cart_id);
        return res.status(200).json({ message: "Update cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ error: error.message || "Update cart failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.updateCartQuantityController = updateCartQuantityController;
const updateOrderStatusController = async (req, res) => {
    try {
        const { cart_id } = req.params;
        const { status } = req.body;
        const { _id: id_user } = req.user;
        const result = await users_services_1.userServices.updateOrderStatus(id_user, cart_id, status);
        return res.status(200).json({ message: "Update order status successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Update order status failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
    }
};
exports.updateOrderStatusController = updateOrderStatusController;
