"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogCategoryController = exports.getBlogCategoryController = exports.deleteBlogCategoryController = exports.updateBlogCategoryController = exports.createBlogCategoryController = void 0;
const blogCategorys_services_1 = require("../services/blogCategorys.services");
const createBlogCategoryController = async (req, res) => {
    try {
        const result = await blogCategorys_services_1.blogCategorysServices.createBlogCategory(req.body);
        return res.status(200).json({ message: "Create BlogCategory successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Create BlogCategory failed", status: 400 });
    }
};
exports.createBlogCategoryController = createBlogCategoryController;
const updateBlogCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await blogCategorys_services_1.blogCategorysServices.updateBlogCategory(id, req.body);
        return res.status(200).json({ message: "Update BlogCategory successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(error.status || 400).json({ message: error.message || "Update BlogCategory failed", status: error.status || 400 });
    }
};
exports.updateBlogCategoryController = updateBlogCategoryController;
const deleteBlogCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await blogCategorys_services_1.blogCategorysServices.deleteBlogCategory(id);
        return res.status(200).json({ message: "Delete BlogCategory successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Delete BlogCategory failed", status: 400 });
    }
};
exports.deleteBlogCategoryController = deleteBlogCategoryController;
const getBlogCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await blogCategorys_services_1.blogCategorysServices.getBlogCategory(id);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get BlogCategory failed", status: 400 });
    }
};
exports.getBlogCategoryController = getBlogCategoryController;
const getAllBlogCategoryController = async (req, res) => {
    try {
        const result = await blogCategorys_services_1.blogCategorysServices.getAllBlogCategory();
        return res.status(200).json({ message: "Get all BlogCategory successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get all BlogCategory failed", status: 400 });
    }
};
exports.getAllBlogCategoryController = getAllBlogCategoryController;
