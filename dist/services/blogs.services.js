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
        // Increment the views and get the blog in one operation
        const blogUpdateResult = await database_services_1.default.blogs.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $inc: { numViews: 1 } }, { returnDocument: 'after' } // Ensure the updated document is returned
        );
        if (!blogUpdateResult.value) {
            throw new type_1.ErrorWithStatus({ message: "Blog not found", status: 404 });
        }
        const blog = blogUpdateResult.value;
        // Use $in operator to get categories, likes, and dislikes in parallel with fewer database calls
        const categoryIds = blog.category.map((item) => new mongodb_1.ObjectId(item));
        const likeUserIds = blog.likes.map((userId) => new mongodb_1.ObjectId(userId.toString()));
        const dislikeUserIds = blog.dislikes.map((userId) => new mongodb_1.ObjectId(userId.toString()));
        const [blogCategories, likedUsers, dislikedUsers] = await Promise.all([
            database_services_1.default.blogCategorys.find({ _id: { $in: categoryIds } }).toArray(),
            database_services_1.default.users.find({ _id: { $in: likeUserIds } }).toArray(),
            database_services_1.default.users.find({ _id: { $in: dislikeUserIds } }).toArray()
        ]);
        return {
            ...blog,
            likes: likedUsers,
            dislikes: dislikedUsers,
            category: blogCategories
        };
    }
    // async getBlog(id: string) {
    //   let getBlog;
    //   const blogUpdateResult = await databaseServices.blogs.findOneAndUpdate(
    //     { _id: new ObjectId(id) },
    //     { $inc: { views: 1 } }
    //   );
    //   if (!blogUpdateResult.value) {
    //     throw new ErrorWithStatus({ message: "Blog not found", status: 404 });
    //   }
    //   const blog = blogUpdateResult.value;
    //   const arrayCategoory = blog.category.map(async (item: any) => {
    //     return await databaseServices.blogCategorys.findOne({ _id: new ObjectId(item) });
    //   })
    //   const userLikePromises = (blog.likes as string[]).map(async (userId: string) => {
    //     const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
    //     return user;
    //   });
    //   const userDislikesPromises = (blog.dislikes as string[]).map(async (userId: string) => {
    //     const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) });
    //     return user;
    //   });
    //   const [likedUsers, dislikedUsers, blogCategorys] = await Promise.all([
    //     Promise.all(userLikePromises),
    //     Promise.all(userDislikesPromises),
    //     Promise.all(arrayCategoory)
    //   ]);
    //   getBlog = {
    //     ...blog,
    //     likes: likedUsers,
    //     dislikes: dislikedUsers,
    //     category: blogCategorys
    //   };
    //   return getBlog;
    // }
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
        let querySort = { created_at: 1 }; // Default sort
        if (obj.sort) {
            const sortDirection = obj.sort === 'desc' ? -1 : 1;
            querySort = { [obj.sort]: sortDirection };
        }
        const pipe = [
            {
                $match: {
                    ...query
                }
            },
            {
                $lookup: {
                    from: "blogCategorys",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            // sort 
            {
                $sort: querySort
            }
        ];
        return await database_services_1.default.blogs.aggregate(pipe).toArray();
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
            throw new type_1.ErrorWithStatus({ message: "Blog not found", status: 404 });
        return result;
    }
    async deleteBlog(id) {
        const { deletedCount } = await database_services_1.default.blogs.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (deletedCount === 0)
            throw new type_1.ErrorWithStatus({ message: "Blog not found", status: 404 });
        return deletedCount;
    }
    async likesBlog(id_blog, user_id) {
        //find blog by id
        const blog = await database_services_1.default.blogs.findOne({ _id: new mongodb_1.ObjectId(id_blog) });
        if (!blog)
            throw new Error("Blog not found");
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
