"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAggregation = void 0;
const mongodb_1 = require("mongodb");
class ProductAggregation {
    constructor() {
        this.pipeline = [];
    }
    matchObject(queryObj, brandId) {
        const matchStage = {
            $match: {
                $and: [
                    queryObj.title ? { title: { $regex: new RegExp(queryObj.title, 'i') } } : {},
                    queryObj.brand ? { brand: brandId } : {},
                    { price: { $gte: queryObj.minPrice || 0, $lte: queryObj.maxPrice || Number.MAX_VALUE } },
                ],
            },
        };
        this.pipeline.push(matchStage);
        return this;
    }
    matchById(id) {
        this.pipeline.push({
            '$match': {
                _id: new mongodb_1.ObjectId(id)
            }
        });
        return this;
    }
    sortObject(sortObj) {
        this.pipeline.push({
            $sort: sortObj
        });
        return this;
    }
    skip(skip) {
        this.pipeline.push({
            $skip: skip
        });
        return this;
    }
    limit(limit) {
        this.pipeline.push({
            $limit: limit
        });
        return this;
    }
    lookupColor() {
        this.pipeline.push({
            '$lookup': {
                'from': 'colors',
                'localField': 'color',
                'foreignField': '_id',
                'as': 'color'
            }
        });
        return this;
    }
    addColorField() {
        this.pipeline.push({
            '$addFields': {
                'color': {
                    '$map': {
                        'input': '$color',
                        'as': 'color',
                        'in': {
                            '_id': '$$color._id',
                            'title': '$$color.title'
                        }
                    }
                }
            }
        });
        return this;
    }
    lookupCategory() {
        this.pipeline.push({
            '$lookup': {
                'from': 'productCategorys',
                'localField': 'category',
                'foreignField': '_id',
                'as': 'category'
            }
        });
        return this;
    }
    addCategoryField() {
        this.pipeline.push({
            '$addFields': {
                'category': {
                    '$map': {
                        'input': '$category',
                        'as': 'cate',
                        'in': {
                            '_id': '$$cate._id',
                            'title': '$$cate.title'
                        }
                    }
                }
            }
        });
        return this;
    }
    addBrandInfo() {
        this.pipeline.push({
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brand"
            }
        }, {
            $unwind: "$brand"
        }, {
            $addFields: {
                "brand": "$brand.title"
            }
        });
        return this;
    }
    async execute(collection) {
        try {
            const result = await collection.aggregate(this.pipeline).toArray();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.ProductAggregation = ProductAggregation;
