"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_IMAGE_TEMP_DIR = exports.UPLOAD_IMAGE_DIR = exports.UPLOAD_IMAGE_BRAND_DIR = exports.UPLOAD_IMAGE_BRAND_TEMP_DIR = exports.UPLOAD_IMAGE_BLOG_DIR = exports.UPLOAD_IMAGE_BLOG_TEMP_DIR = exports.UPLOAD_IMAGE_PRODUCT_DIR = exports.UPLOAD_IMAGE_PRODUCT_TEMP_DIR = void 0;
const path_1 = __importDefault(require("path"));
exports.UPLOAD_IMAGE_PRODUCT_TEMP_DIR = path_1.default.resolve('uploads/products/temp');
exports.UPLOAD_IMAGE_PRODUCT_DIR = path_1.default.resolve('uploads/products');
exports.UPLOAD_IMAGE_BLOG_TEMP_DIR = path_1.default.resolve('uploads/blogs/temp');
exports.UPLOAD_IMAGE_BLOG_DIR = path_1.default.resolve('uploads/blogs');
exports.UPLOAD_IMAGE_BRAND_TEMP_DIR = path_1.default.resolve('uploads/brands/temp');
exports.UPLOAD_IMAGE_BRAND_DIR = path_1.default.resolve('uploads/brands');
exports.UPLOAD_IMAGE_DIR = path_1.default.resolve('uploads/images');
exports.UPLOAD_IMAGE_TEMP_DIR = path_1.default.resolve('uploads/images/temp');
