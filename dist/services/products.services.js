"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productServices = void 0;
const products_models_1 = __importDefault(require("../models/products.models"));
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const slug_1 = __importDefault(require("slug"));
const file_1 = require("../utils/file");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const dir_1 = require("../constants/dir");
const cloudinary_1 = require("../utils/cloudinary");
const aggregation_models_1 = require("../models/aggregation.models");
class ProductServices {
    async createProduct(payload) {
        const _id = new mongodb_1.ObjectId();
        await database_services_1.default.brands.updateOne({ _id: new mongodb_1.ObjectId(payload.brand) }, {
            $inc: {
                quantity: 1
            }
        });
        await database_services_1.default.products.insertOne(new products_models_1.default({
            _id,
            ...payload,
            slug: (0, slug_1.default)(payload.title || payload.slug, { lower: true })
        }));
        return database_services_1.default.products.findOne({ _id });
    }
    async getProduct(id) {
        const aggregation = new aggregation_models_1.ProductAggregation();
        const result = await aggregation
            .matchById(id)
            .lookupColor()
            .addColorField()
            .lookupCategory()
            .addCategoryField()
            .addBrandInfo()
            .execute(database_services_1.default.products);
        return result;
    }
    async getColors(colors) {
        const ids = colors.map((item) => new mongodb_1.ObjectId(item.color));
        return await database_services_1.default.colors.find({ _id: { $in: ids } }).toArray();
    }
    async getAllProducts(queryObj) {
        let brandId;
        if (queryObj.brand) {
            const brandName = await database_services_1.default.brands.findOne({ title: RegExp(queryObj.brand || "", "i") });
            brandId = brandName?._id;
        }
        const aggregation = new aggregation_models_1.ProductAggregation();
        const result = await aggregation
            .matchObject(queryObj, brandId)
            .lookupColor()
            .addColorField()
            .lookupCategory()
            .addCategoryField()
            .addBrandInfo()
            .sortObject(queryObj.sort ? { [queryObj.sort]: queryObj.sort === 'desc' ? -1 : 1 } : { created_at: 1 })
            .skip(queryObj.page && queryObj.page > 0 ? (queryObj.page - 1) * (queryObj.limit || 10) : 0)
            .limit(queryObj.limit ? Number(queryObj.limit) : 10)
            .execute(database_services_1.default.products);
        const totalItem = await this.getCountProducts(queryObj);
        return {
            total: totalItem.total,
            data: result,
        };
    }
    async updateProduct(id, payload) {
        const product = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(id) });
        if (payload.brand) {
            payload.brand = new mongodb_1.ObjectId(payload.brand);
        }
        if (payload.category) {
            payload.category = payload.category.map((item) => new mongodb_1.ObjectId(item));
        }
        if (payload.color) {
            payload.color = payload.color.map((item) => new mongodb_1.ObjectId(item));
        }
        return await database_services_1.default.products.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
            $set: {
                ...payload, updated_at: new Date(), slug: (0, slug_1.default)(payload.title || product?.title, { lower: true })
            }
        }, { returnDocument: "after" });
    }
    async deleteProduct(id) {
        await database_services_1.default.products.deleteOne({ _id: new mongodb_1.ObjectId(id) });
    }
    async addToWishList(product_id, user) {
        const alreadyAdded = user.wishlist?.find((item) => item.toString() === product_id);
        if (alreadyAdded) {
            return await database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(user._id) }, {
                $pull: {
                    wishlist: product_id
                }
            }, { returnDocument: "after" });
        }
        else {
            return await database_services_1.default.users.findOneAndUpdate({ _id: new mongodb_1.ObjectId(user._id) }, {
                $push: {
                    wishlist: product_id
                }
            }, { returnDocument: "after" });
        }
    }
    async rating(product_id, user_id, star, comment) {
        const product = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(product_id) });
        const existingRating = product?.ratings?.find((item) => item.postedBy.toString() === user_id.toString());
        if (existingRating) {
            await database_services_1.default.products.findOneAndUpdate({
                ratings: { $elemMatch: existingRating } // $elemMatch: Matches documents that contain an array field with at least one element that matches all the specified query criteria.
            }, {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment } // $ is the first position of the element in the array that matches the query condition.
            }, { returnDocument: "after" });
        }
        else {
            await database_services_1.default.products.findOneAndUpdate({ _id: new mongodb_1.ObjectId(product_id) }, {
                $push: {
                    ratings: {
                        star,
                        comment,
                        postedBy: user_id
                    }
                }
            }, { returnDocument: "after" });
        }
        // caculator rating
        const productAllRating = await database_services_1.default.products.findOne({ _id: new mongodb_1.ObjectId(product_id) });
        const lengthRatingProc = productAllRating?.ratings?.length;
        const sumRating = productAllRating?.ratings?.reduce((prev, item) => prev + item.star, 0);
        return await database_services_1.default.products.findOneAndUpdate({ _id: new mongodb_1.ObjectId(product_id) }, {
            $set: {
                rating_distribution: Math.round(Number(sumRating) / Number(lengthRatingProc))
            }
        });
    }
    async uploadImage(req) {
        const files = await (0, file_1.handleuploadImage)(req, dir_1.UPLOAD_IMAGE_PRODUCT_TEMP_DIR);
        const urls = [];
        await Promise.all(files.map(async (file) => {
            const fileName = (0, file_1.getFileName)(file);
            const newPath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_PRODUCT_DIR, `${fileName}`);
            await (0, sharp_1.default)(file.filepath).jpeg().toFile(newPath);
            fs_1.default.unlink(file.filepath, (err) => {
                console.log(err);
            });
            urls.push(await (0, cloudinary_1.cloudinaryUploadImage)(newPath));
        }));
        return await database_services_1.default.products.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.params.id) }, {
            $push: {
                images: { $each: urls }
            }
        }, { returnDocument: "after" });
    }
    async getAllOrders(search) {
        //6511672d1109dcb621f83d44
        const piper = [
            {
                $match: {}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "orderby",
                    foreignField: "_id",
                    as: "orderby",
                },
            },
            {
                $unwind: "$orderby",
            },
            {
                $addFields: {
                    orderby: "$orderby.email",
                },
            },
            {
                $unwind: "$products",
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "products.product",
                },
            },
            {
                $unwind: "$products.product",
            },
            {
                $addFields: {
                    "products.product.color": "$products.color",
                },
            },
            {
                $lookup: {
                    from: "colors",
                    localField: "products.color",
                    foreignField: "_id",
                    as: "products.color",
                },
            },
            {
                $addFields: {
                    "products.product.color": {
                        $arrayElemAt: [
                            "$products.color.title",
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    "products.color": 0,
                },
            },
        ];
        if (search) {
            piper.push({
                $match: {
                    order_status: search
                }
            });
        }
        const result = await database_services_1.default.order.aggregate(piper).toArray();
        return result;
    }
    async getCountProducts(queryObj) {
        let brandId;
        if (queryObj.brand) {
            const brandName = await database_services_1.default.brands.findOne({ title: RegExp(queryObj.brand || "", "i") });
            brandId = brandName?._id;
        }
        const pipeline = [
            {
                $match: {
                    $and: [
                        queryObj.title ? { title: { $regex: new RegExp(queryObj.title, 'i') } } : {},
                        queryObj.brand ? { brand: brandId } : {},
                        { price: { $gte: queryObj.minPrice || 0, $lte: queryObj.maxPrice || Number.MAX_VALUE } },
                    ],
                },
            },
            {
                $count: "total",
            },
        ];
        const result = await database_services_1.default.products.aggregate(pipeline).toArray();
        if (result.length > 0) {
            return { total: result[0].total };
        }
        else {
            return { total: 0 }; // Trường hợp không có sản phẩm nào thỏa mãn điều kiện tìm kiếm
        }
    }
}
//notice slug
exports.productServices = new ProductServices();
