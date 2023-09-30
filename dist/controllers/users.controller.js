"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusController = exports.getOrderController = exports.createOrderController = exports.getUserCartController = exports.userAddCartController = exports.getWhishListController = exports.logoutController = exports.updatePasswordController = exports.refreshTokenController = exports.unBlockUserController = exports.blockUserController = exports.deleteUserController = exports.updateUserController = exports.applyCouponController = exports.getEmptyCartController = exports.getUserController = exports.getAllUserController = exports.resetPasswordController = exports.forgotPasswordTokenController = exports.loginAdminController = exports.loginController = exports.registerController = void 0;
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
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Register failed", status: enum_1.ErrorStatus.INTERNAL_SERVER, error });
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
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Login failed", status: enum_1.ErrorStatus.INTERNAL_SERVER, error: error.message });
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
        return res.status(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: error.message || "Login failed", status: error.status || enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.loginAdminController = loginAdminController;
const forgotPasswordTokenController = async (req, res) => {
    try {
        const { email } = req.body;
        const token = await users_services_1.userServices.forgotPasswordToken(email);
        const resetUrl = `Hi ${email}, please click this link to reset your password: <a href="http://localhost:${process.env.PORT}/api/users/reset-password/${token}">Reset password</a>`;
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
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Send forgot password token failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
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
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Reset password failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
    }
};
exports.resetPasswordController = resetPasswordController;
const getAllUserController = async (req, res) => {
    try {
        const result = await users_services_1.userServices.getAllUser();
        return res.status(200).json({ message: "Get user successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.FORBIDDEN).json({ message: "Get user failed", status: enum_1.ErrorStatus.FORBIDDEN, error });
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
        return res.status(enum_1.ErrorStatus.FORBIDDEN).json({ message: "Get user failed", status: enum_1.ErrorStatus.FORBIDDEN, error });
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
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Empty cart failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
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
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Apply coupon failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.applyCouponController = applyCouponController;
const updateUserController = async (req, res) => {
    const { _id } = req.user;
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
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Refresh token failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
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
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Update password failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
    }
};
exports.updatePasswordController = updatePasswordController;
const logoutController = async (req, res) => {
    try {
        const cookie = req.cookies;
        await users_services_1.userServices.logout(cookie.refresh_token);
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true
        });
        console.log("Logout successfully");
        return res.sendStatus(204);
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.FORBIDDEN).json({ message: "Logout failed", status: enum_1.ErrorStatus.FORBIDDEN });
    }
};
exports.logoutController = logoutController;
const getWhishListController = async (req, res) => {
    try {
        const result = await users_services_1.userServices.getWishList(req.user.email);
        return res.status(200).json({ message: "Get wishlist successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Get wishlist failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
    }
};
exports.getWhishListController = getWhishListController;
const userAddCartController = async (req, res) => {
    try {
        const { cart } = req.body;
        const { _id } = req.user;
        const result = await users_services_1.userServices.addCartByUserId(_id, cart);
        return res.status(200).json({ message: "Get cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Get cart failed", status: enum_1.ErrorStatus.BAD_REQUEST, error: error.message });
    }
};
exports.userAddCartController = userAddCartController;
const getUserCartController = async (req, res) => {
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.getUserCart(_id);
        return res.status(200).json({ message: "Get cart successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Get cart failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
    }
};
exports.getUserCartController = getUserCartController;
const createOrderController = async (req, res) => {
    const { COD, couponApplied } = req.body;
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.createOrder(_id, COD, couponApplied);
        return res.status(200).json({ message: "Create order successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Create order failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
    }
};
exports.createOrderController = createOrderController;
const getOrderController = async (req, res) => {
    try {
        const { _id } = req.user;
        const result = await users_services_1.userServices.getOrder(_id);
        return res.status(200).json({ message: "Get order successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: "Get order failed", status: enum_1.ErrorStatus.BAD_REQUEST, error });
    }
};
exports.getOrderController = getOrderController;
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
