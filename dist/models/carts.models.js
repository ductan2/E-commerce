"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carts = void 0;
const mongodb_1 = require("mongodb");
class Carts {
    constructor(cart) {
        this._id = cart._id || new mongodb_1.ObjectId();
        this.product = cart.product;
        this.cartTotal = cart.cartTotal || 0;
        this.amount = cart.amount || 0;
        this.color = cart.color;
        this.totalAfterDiscount = cart.totalAfterDiscount;
        this.orderby = cart.orderby || "";
        this.created_at = cart.created_at || new Date();
        this.updated_at = cart.updated_at || new Date();
    }
}
exports.Carts = Carts;
