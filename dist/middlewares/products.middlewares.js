"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingValidator = exports.WishListValidator = exports.UpdateProductValidator = exports.ProductsValidator = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
const database_services_1 = __importDefault(require("../services/database.services"));
exports.ProductsValidator = (0, express_validator_1.checkSchema)({
    title: {
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 50,
            },
            errorMessage: "Title must be at least 2 characters long and less than 25 characters long."
        },
    },
    slug: {
        optional: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 50,
            },
            errorMessage: "Slug must be at least 2 characters long and less than 25 characters long."
        },
    },
    description: {
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 500,
            },
            errorMessage: "Description must be at least 2 characters long and less than 25 characters long."
        },
    },
    price: {
        notEmpty: true,
        isNumeric: true,
        errorMessage: "Price must be a number"
    },
    category: {
        notEmpty: true,
        isArray: true,
        errorMessage: "Category must be an array objectId",
        custom: {
            options: async (value) => {
                const ids = value.map((item) => new mongodb_1.ObjectId(item));
                const isProc = await database_services_1.default.productCategorys.find({ _id: { $in: ids } }).toArray();
                if (isProc.length !== value.length)
                    throw new type_1.ErrroWithStatus({ message: "Category is not exist", status: 404 });
                return true;
            }
        }
    },
    brand: {
        optional: true,
        custom: {
            options: async (value) => {
                const isBrand = await database_services_1.default.brands.findOne({ _id: new mongodb_1.ObjectId(value) });
                if (!isBrand)
                    throw new type_1.ErrroWithStatus({ message: "Brand is not exist", status: 404 });
                return true;
            }
        }
    },
    quantity: {
        notEmpty: true,
        isNumeric: true,
    },
}, ["body"]);
exports.UpdateProductValidator = (0, express_validator_1.checkSchema)({
    title: {
        trim: true,
        optional: true,
        isLength: {
            options: {
                min: 2,
                max: 50,
            },
            errorMessage: "Title must be at least 2 characters long and less than 25 characters long."
        },
    },
    slug: {
        trim: true,
        optional: true,
        isLength: {
            options: {
                min: 2,
                max: 50,
            },
            errorMessage: "Slug must be at least 2 characters long and less than 25 characters long."
        },
    },
    description: {
        trim: true,
        optional: true,
        isLength: {
            options: {
                min: 2,
                max: 500,
            },
            errorMessage: "Description must be at least 2 characters long and less than 25 characters long."
        },
    },
    price: {
        isNumeric: true,
        optional: true,
        errorMessage: "Price must be a number"
    },
    category: {
        optional: true,
        isLength: {
            options: {
                min: 2,
                max: 50,
            },
            errorMessage: "Category must be at least 2 characters long and less than 25 characters long."
        },
    },
    brand: {
        optional: true,
        custom: {
            options: async (value) => {
                const isBrand = await database_services_1.default.brands.findOne({ _id: new mongodb_1.ObjectId(value) });
                if (!isBrand)
                    throw new type_1.ErrroWithStatus({ message: "Brand is not exist", status: 404 });
                return true;
            }
        }
    },
    quantity: {
        optional: true,
        isNumeric: true,
    },
}, ["body"]);
exports.WishListValidator = (0, express_validator_1.checkSchema)({
    product_id: {
        notEmpty: true,
        trim: true,
        custom: {
            options: async (value) => {
                const isProc = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(value) });
                if (!isProc)
                    throw new type_1.ErrroWithStatus({ message: "Product is not exist", status: 404 });
            }
        }
    },
}, ["body"]);
exports.RatingValidator = (0, express_validator_1.checkSchema)({
    product_id: {
        notEmpty: true,
        trim: true,
        custom: {
            options: async (value) => {
                const isProc = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(value) });
                if (!isProc)
                    throw new type_1.ErrroWithStatus({ message: "Product is not exist", status: 404 });
            }
        }
    },
    star: {
        notEmpty: true,
        isNumeric: true,
        errorMessage: "Star must be a number",
        isIn: { options: [[1, 2, 3, 4, 5]], errorMessage: "Star is invalid!" }
    },
    comment: {
        optional: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 500,
            },
            errorMessage: "Comment must be at least 2 characters long and less than 500 characters long."
        },
    }
}, ["body"]);
