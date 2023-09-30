"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogServices = void 0;
const blogs_models_1 = __importDefault(require("../models/blogs.models"));
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
const file_1 = require("../utils/file");
const path_1 = __importDefault(require("path"));
const dir_1 = require("../constants/dir");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../utils/cloudinary");
class BlogServices {
    async createBlog(payload) {
        if (payload.category) {
            payload.category = payload.category.map((item) => new mongodb_1.ObjectId(item));
        }
        const result = await database_services_1.default.blogs.insertOne(new blogs_models_1.default({
            ...payload,
        }));
        return result;
    }
    async getBlog(id) {
        let getBlog;
        const blogUpdateResult = await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $inc: { views: 1 } });
        if (!blogUpdateResult.value) {
            throw new type_1.ErrroWithStatus({ message: "Blog not found", status: 404 });
        }
        const blog = blogUpdateResult.value;
        const userLikePromises = blog.likes.map(async (userId) => {
            const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(userId) });
            return user;
        });
        const userDislikesPromises = blog.dislikes.map(async (userId) => {
            const user = await database_services_1.default.users.findOne({ _id: new mongodb_1.ObjectId(userId) });
            return user;
        });
        const [likedUsers, dislikedUsers] = await Promise.all([
            Promise.all(userLikePromises),
            Promise.all(userDislikesPromises)
        ]);
        getBlog = {
            ...blog,
            likes: likedUsers,
            dislikes: dislikedUsers,
        };
        return getBlog;
    }
    // async getBlog(id: string) {
    //   let getBlog;
    //   await databaseServices.blogs.findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { views: 1 } })
    //   await databaseServices.blogs.findOne({ _id: new ObjectId(id) }).then((blog) => {
    //     console.log("🚀 ~ file: blogs.services.ts:27 ~ BlogServices ~ awaitdatabaseServices.blogs.findOne ~ blog:", blog)
    //     const user = (blog?.likes as string[]).find(async (item: string) => {
    //       return databaseServices.users.findOne({ _id: new ObjectId(item.toString()) })
    //     })
    //     getBlog = {
    //       ...blog, likes: user
    //     }
    //   });
    //   return getBlog;
    // }
    async getAllBlogs(obj) {
        let query = {
            title: { $regex: new RegExp(obj.title || "", "i") },
        };
        let querySort = {};
        if (obj.sort) {
            querySort = obj.sort ? { [obj.sort]: obj.sort === 'desc' ? -1 : 1 } : { created_at: 1 };
        }
        return await database_services_1.default.blogs.find(query).sort(querySort).toArray();
    }
    async updateBlog(id, payload) {
        if (payload.category) {
            payload.category = payload.category.map((item) => new mongodb_1.ObjectId(item));
        }
        const result = await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                ...payload, updated_at: new Date()
            }
        }, { returnDocument: "after" });
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "Blog not found", status: 404 });
        return result;
    }
    async deleteBlog(id) {
        const { deletedCount } = await database_services_1.default.blogs.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (deletedCount === 0)
            throw new type_1.ErrroWithStatus({ message: "Blog not found", status: 404 });
        return deletedCount;
    }
    async likesBlog(id_blog, user_id) {
        //find blog by id
        const blog = await database_services_1.default.blogs.findOne({ _id: new mongodb_1.ObjectId(id_blog) });
        const isLike = blog?.isLiked;
        // check if user has dislike this blog
        const alreadyDislike = (blog?.dislikes).find((item) => item.toString() === user_id.toString());
        if (alreadyDislike) {
            await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_blog) }, { $set: { isDisliked: false }, $pull: { dislikes: user_id } }, { returnDocument: "after" });
        }
        if (isLike) {
            const newBlog = await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_blog) }, { $set: { isLiked: false }, $pull: { likes: user_id } }, { returnDocument: "after" });
            return newBlog;
        }
        else {
            return await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_blog) }, { $set: { isLiked: true }, $push: { likes: user_id } }, { returnDocument: "after" });
        }
    }
    async dislikesBlog(id_blog, user_id) {
        //find blog by id
        const blog = await database_services_1.default.blogs.findOne({ _id: new mongodb_1.ObjectId(id_blog) });
        const isDislikes = blog?.isDisliked;
        // check if user has dislike this blog
        const alreadyLike = (blog?.likes).find((item) => item.toString() === user_id.toString());
        if (alreadyLike) {
            await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_blog) }, { $set: { isLiked: false }, $pull: { likes: user_id } }, { returnDocument: "after" });
        }
        if (isDislikes) {
            return await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_blog) }, { $set: { isDisliked: false }, $pull: { dislikes: user_id } }, { returnDocument: "after" });
        }
        else {
            return await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id_blog) }, { $set: { isDisliked: true }, $push: { dislikes: user_id } }, { returnDocument: "after" });
        }
    }
    async uploadImage(req) {
        const files = await (0, file_1.handleuploadImage)(req, dir_1.UPLOAD_IMAGE_BLOG_TEMP_DIR);
        let image = [];
        await Promise.all(files.map(async (file) => {
            const fileName = (0, file_1.getFileName)(file);
            const newPath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_BLOG_DIR, `${fileName}`);
            console.log(newPath);
            await (0, sharp_1.default)(file.filepath).jpeg().toFile(newPath);
            fs_1.default.unlink(file.filepath, (err) => {
                console.log(err);
            });
            image = await (0, cloudinary_1.cloudinaryUploadImage)(newPath);
        }));
        console.log(image);
        return await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.params.id) }, {
            $set: {
                images: image
            }
        }, { returnDocument: "after" });
    }
}
exports.blogServices = new BlogServices();
