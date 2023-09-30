"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class Products {
    constructor(product) {
        const date = new Date();
        this._id = product._id || new mongodb_1.ObjectId();
        this.title = product.title || "";
        this.slug = product.slug || "";
        this.description = product.description || "";
        this.price = product.price || 0;
        this.brand = new mongodb_1.ObjectId(product.brand) || "NO BRAND";
        this.category = product.category?.map((item) => new mongodb_1.ObjectId(item)) || [];
        this.quantity = product.quantity || 0;
        this.images = product.images || [];
        this.sold = product.sold || 0;
        this.trending = product.trending || false;
        this.featured = product.featured || false;
        this.color = product.color?.map((item) => new mongodb_1.ObjectId(item)) || [];
        this.rating_distribution = product.rating_distribution || 5;
        this.ratings = product.ratings || [];
        this.craeted_at = product.craeted_at || date;
        this.updated_at = product.updated_at || date;
    }
}
exports.default = Products;
