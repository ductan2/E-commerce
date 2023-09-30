"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Coupons {
    constructor(coupon) {
        this._id = coupon._id || new mongodb_1.ObjectId;
        this.name = coupon.name;
        this.expire_date = coupon.expire_date;
        this.discount = coupon.discount;
        this.created_at = coupon.created_at || new Date;
        this.updated_at = coupon.updated_at || new Date;
    }
}
exports.default = Coupons;
