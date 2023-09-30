"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsServices = void 0;
const coupons_models_1 = __importDefault(require("../models/coupons.models"));
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
class CouponsServices {
    async createCoupon(payload) {
        return await database_services_1.default.coupons.insertOne(new coupons_models_1.default({
            ...payload,
            name: payload.name.toUpperCase(),
            expire_date: new Date(payload.expire_date),
            discount: Number(payload.discount),
        }));
    }
    async getAllCoupons() {
        return await database_services_1.default.coupons.find().toArray();
    }
    async updateCoupon(id, payload) {
        const result = await database_services_1.default.coupons.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...payload, updated_at: new Date() } }, { returnDocument: "after" });
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "BlogCategory does not exits!", status: 404 });
        return result;
    }
    async deleteCoupon(id) {
        return await database_services_1.default.coupons.deleteOne({ _id: new mongodb_1.ObjectId(id) });
    }
}
exports.couponsServices = new CouponsServices();
