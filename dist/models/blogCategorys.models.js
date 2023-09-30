"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class BlogCategorys {
    constructor(cate) {
        this._id = cate._id || new mongodb_1.ObjectId;
        this.title = cate.title;
        this.created_at = cate.created_at || new Date();
        this.updated_at = cate.updated_at || new Date();
    }
}
exports.default = BlogCategorys;
