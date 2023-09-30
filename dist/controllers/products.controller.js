"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersController = exports.deleteImageController = exports.uploadImageController = exports.ratingController = exports.addToWishListController = exports.getAllProductController = exports.deleteProductController = exports.updateProductController = exports.getCountProductsController = exports.getProductController = exports.createProductController = void 0;
const dir_1 = require("../constants/dir");
const enum_1 = require("../constants/enum");
const products_services_1 = require("../services/products.services");
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = require("../utils/file");
const createProductController = async (req, res) => {
    try {
        const result = await products_services_1.productServices.createProduct(req.body);
        return res.status(200).json({ message: "Product create successfully", status: 200, result });
    }
    catch (error) {
        return res.status(500).json({ message: "Product create failed", status: 500, error: error.message });
    }
};
exports.createProductController = createProductController;
const getProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await products_services_1.productServices.getProduct(id);
        return res.status(200).json({ message: "Get a product successfully", status: 200, result });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Get Product failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.getProductController = getProductController;
const getCountProductsController = async (req, res) => {
    try {
        const obj = { ...req.query };
        const result = await products_services_1.productServices.getCountProducts(obj);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Get count products failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.getCountProductsController = getCountProductsController;
const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await products_services_1.productServices.updateProduct(id, req.body);
        return res.status(200).json({ message: "Update Product successfully", status: 200, result: value });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Update Product failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.updateProductController = updateProductController;
const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        await products_services_1.productServices.deleteProduct(id);
        return res.status(200).json({ message: "Delete Product successfully", status: 200 });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Delete Product failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.deleteProductController = deleteProductController;
const getAllProductController = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const result = await products_services_1.productServices.getAllProducts(queryObj);
        return res.status(200).json({ message: "Get Products successfully", status: 200, result });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: error.message || "Get Products failed", status: enum_1.ErrorStatus.INTERNAL_SERVER, error });
    }
};
exports.getAllProductController = getAllProductController;
const addToWishListController = async (req, res) => {
    try {
        const { product_id } = req.body;
        const { value } = await products_services_1.productServices.addToWishList(product_id, req.user);
        return res.status(200).json({ message: "Add to wishlist successfully", status: 200, result: value });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Add to wishlist failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.addToWishListController = addToWishListController;
const ratingController = async (req, res) => {
    try {
        const { _id: user_id } = req.user;
        const { product_id, star, comment } = req.body;
        const { value } = await products_services_1.productServices.rating(product_id, user_id, star, comment);
        return res.status(200).json({ message: "Rating successfully", status: 200, result: value });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Rating failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.ratingController = ratingController;
const uploadImageController = async (req, res) => {
    (0, file_1.initFolder)(dir_1.UPLOAD_IMAGE_PRODUCT_TEMP_DIR);
    try {
        const { value } = await products_services_1.productServices.uploadImage(req);
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
const getAllOrdersController = async (req, res) => {
    try {
        const { search } = req.query;
        const result = await products_services_1.productServices.getAllOrders(search);
        return res.status(200).json({ message: "Get all orders successfully", status: 200, result });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Get all orders failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.getAllOrdersController = getAllOrdersController;
