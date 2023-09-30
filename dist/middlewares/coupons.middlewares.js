"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponsValidator = exports.CouponsValidator = void 0;
const express_validator_1 = require("express-validator");
const database_services_1 = __importDefault(require("../services/database.services"));
exports.CouponsValidator = (0, express_validator_1.checkSchema)({
    name: {
        notEmpty: true,
        trim: true,
        isString: true,
        isLength: {
            options: {
                min: 1,
                max: 100,
            }
        },
        custom: {
            options: async (value) => {
                const nameCoupon = value.toUpperCase();
                const isExist = await database_services_1.default.coupons.findOne({ name: nameCoupon });
                if (isExist)
                    throw new Error("Coupon is exist");
            }
        }
    },
    expire_date: {
        notEmpty: true,
        trim: true,
    },
    discount: {
        notEmpty: true,
        trim: true,
        isNumeric: true,
        errorMessage: "Discount must be a number"
    }
}, ["body"]);
exports.updateCouponsValidator = (0, express_validator_1.checkSchema)({
    name: {
        optional: true,
        trim: true,
        isString: true,
        isLength: {
            options: {
                min: 1,
                max: 100,
            }
        },
        custom: {
            options: async (value) => {
                const nameCoupon = value.toUpperCase();
                const isExist = await database_services_1.default.coupons.findOne({ name: nameCoupon });
                if (isExist)
                    throw new Error("Coupon is exist");
            }
        }
    },
    expire_date: {
        optional: true,
        trim: true,
    },
    discount: {
        optional: true,
        trim: true,
        isNumeric: true,
        errorMessage: "Discount must be a number"
    }
}, ["body"]);
