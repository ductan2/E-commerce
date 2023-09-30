"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCouponController = exports.updateCouponController = exports.getAllCouponsController = exports.createCouponController = void 0;
const coupons_services_1 = require("../services/coupons.services");
const createCouponController = async (req, res) => {
    try {
        const { name, expire_date, discount } = req.body;
        const result = await coupons_services_1.couponsServices.createCoupon({ name, expire_date, discount });
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Create coupon failed", status: 400 });
    }
};
exports.createCouponController = createCouponController;
const getAllCouponsController = async (req, res) => {
    try {
        const result = await coupons_services_1.couponsServices.getAllCoupons();
        return res.status(200).json({
            message: "Get all coupons successfully",
            status: 200,
            result
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get all coupons failed", status: 400 });
    }
};
exports.getAllCouponsController = getAllCouponsController;
const updateCouponController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await coupons_services_1.couponsServices.updateCoupon(id, req.body);
        return res.status(200).json({
            message: "Update coupon successfully",
            status: 200,
            result: value
        });
    }
    catch (error) {
        return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 });
    }
};
exports.updateCouponController = updateCouponController;
const deleteCouponController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await coupons_services_1.couponsServices.deleteCoupon(id);
        return res.status(200).json({
            message: "Delete coupon successfully",
            status: 200,
            result
        });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Delete coupon failed", status: 400 });
    }
};
exports.deleteCouponController = deleteCouponController;
