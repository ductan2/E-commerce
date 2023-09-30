"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Brands {
    constructor(brand) {
        this._id = brand._id || new mongodb_1.ObjectId;
        this.title = brand.title;
        this.images = brand.images || "https://www.wfmalaysia.com/image/wfmalaysia/image/data/Screenshot%202020-07-05%20at%206.34.45%20PM.png";
        this.quantity = brand.quantity || 0;
        this.created_at = brand.created_at || new Date();
        this.updated_at = brand.updated_at || new Date();
    }
}
exports.default = Brands;
