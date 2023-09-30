"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongodb_1 = require("mongodb");
const enum_1 = require("../constants/enum");
class Order {
    constructor(order) {
        this._id = order._id || new mongodb_1.ObjectId();
        this.products = order.products || [];
        this.payment_intent = order.payment_intent || {};
        this.order_status = order.order_status || enum_1.statusOrder.CASH_ON_DELIVERY;
        this.orderby = order.orderby;
        this.created_at = order.created_at || new Date();
        this.updated_at = order.updated_at || new Date();
    }
}
exports.Order = Order;
