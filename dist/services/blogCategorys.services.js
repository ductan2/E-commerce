"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogCategorysServices = void 0;
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
const blogCategorys_models_1 = __importDefault(require("../models/blogCategorys.models"));
class BlogCategorysServices {
    async createBlogCategory(payload) {
        return await database_services_1.default.blogCategorys.insertOne(new blogCategorys_models_1.default({ ...payload, created_at: new Date(), updated_at: new Date() }));
    }
    async updateBlogCategory(id, payload) {
        const result = await database_services_1.default.blogCategorys.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(id)
        }, {
            $set: {
                ...payload, updated_at: new Date()
            }
        }, { returnDocument: "after" });
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "BlogCategory does not exits!", status: 404 });
        return result;
    }
    async deleteBlogCategory(id) {
        return await database_services_1.default.blogCategorys.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getBlogCategory(id) {
        return await database_services_1.default.blogCategorys.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getAllBlogCategory() {
        return await database_services_1.default.blogCategorys.find().toArray();
    }
}
exports.blogCategorysServices = new BlogCategorysServices();
