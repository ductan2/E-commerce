"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageController = exports.uploadImageController = exports.disLikesBlogController = exports.likesBlogController = exports.deleteBlogController = exports.updateBlogController = exports.getAllBlogsController = exports.getBlogController = exports.createBlogController = void 0;
const dir_1 = require("../constants/dir");
const enum_1 = require("../constants/enum");
const blogs_services_1 = require("../services/blogs.services");
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = require("../utils/file");
const createBlogController = async (req, res) => {
    try {
        const result = await blogs_services_1.blogServices.createBlog(req.body);
        return res.status(200).json({ message: "Create Blog successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Create Blog failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.createBlogController = createBlogController;
const getBlogController = async (req, res) => {
    try {
        const result = await blogs_services_1.blogServices.getBlog(req.params.id);
        return res.status(200).json({ message: "Get Blog successfully", status: 200, result });
    }
    catch (error) {
        return res.status(error.status || enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Get Blog failed", status: error.status || enum_1.ErrorStatus.NOT_FOUND });
    }
};
exports.getBlogController = getBlogController;
const getAllBlogsController = async (req, res) => {
    try {
        const obj = { ...req.query };
        const result = await blogs_services_1.blogServices.getAllBlogs(obj);
        return res.status(200).json({ message: "Get All Blogs successfully", status: 200, result });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Get All Blogs failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.getAllBlogsController = getAllBlogsController;
const updateBlogController = async (req, res) => {
    try {
        const { value } = await blogs_services_1.blogServices.updateBlog(req.params.id, req.body);
        return res.status(200).json({ message: "Update Blog successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Update Blog failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.updateBlogController = updateBlogController;
const deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        await blogs_services_1.blogServices.deleteBlog(id);
        return res.status(200).json({ message: "Delete Blog successfully", status: 200 });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Delete Blog failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.deleteBlogController = deleteBlogController;
const likesBlogController = async (req, res) => {
    try {
        const { id_blog } = req.body;
        const { _id: user_id } = req.user;
        const { value } = await blogs_services_1.blogServices.likesBlog(id_blog, user_id);
        return res.status(200).json({ message: "Likes Blog successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Likes Blog failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.likesBlogController = likesBlogController;
const disLikesBlogController = async (req, res) => {
    try {
        const { id_blog } = req.body;
        const { _id: user_id } = req.user;
        const { value } = await blogs_services_1.blogServices.dislikesBlog(id_blog, user_id);
        return res.status(200).json({ message: "Dislike Blog successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(enum_1.ErrorStatus.BAD_REQUEST).json({ message: error.message || "Dislike Blog failed", status: enum_1.ErrorStatus.BAD_REQUEST });
    }
};
exports.disLikesBlogController = disLikesBlogController;
const uploadImageController = async (req, res) => {
    (0, file_1.initFolder)(dir_1.UPLOAD_IMAGE_BLOG_TEMP_DIR);
    try {
        const { value } = await blogs_services_1.blogServices.uploadImage(req);
        return res.status(200).json({ message: "Upload image successfully", status: 200, result: value });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Upload image failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.uploadImageController = uploadImageController;
const deleteImageController = async (req, res) => {
    const { id } = req.params;
    try {
        const uploader = (0, cloudinary_1.cloudinaryDeleteImage)(id);
        return res.json({ message: "Delete image successfully", status: 200 });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Delete image failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.deleteImageController = deleteImageController;
