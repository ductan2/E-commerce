"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandsServices = void 0;
const brand_models_1 = __importDefault(require("../models/brand.models"));
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
const file_1 = require("../utils/file");
const dir_1 = require("../constants/dir");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../utils/cloudinary");
class BrandsServices {
    async createBrand(payload) {
        return await database_services_1.default.brands.insertOne(new brand_models_1.default({ ...payload }));
    }
    async updateBrand(id, payload) {
        const result = await database_services_1.default.brands.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(id)
        }, {
            $set: {
                ...payload, updated_at: new Date()
            }
        }, { returnDocument: "after" });
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "Brand does not exits!", status: 404 });
        return result;
    }
    async uploadImage(req) {
        const files = await (0, file_1.handleuploadImage)(req, dir_1.UPLOAD_IMAGE_BRAND_TEMP_DIR);
        let image = [];
        await Promise.all(files.map(async (file) => {
            const fileName = (0, file_1.getFileName)(file);
            const newPath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_BRAND_DIR, `${fileName}`);
            console.log(newPath);
            await (0, sharp_1.default)(file.filepath).jpeg().toFile(newPath);
            fs_1.default.unlink(file.filepath, (err) => {
                console.log(err);
            });
            image = await (0, cloudinary_1.cloudinaryUploadImage)(newPath);
        }));
        console.log(image);
        return await database_services_1.default.brands.findOneAndUpdate({ _id: new mongodb_1.ObjectId(req.params.id) }, {
            $set: {
                images: image
            }
        }, { returnDocument: "after" });
    }
    async deleteBrand(id) {
        return await database_services_1.default.brands.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getBrand(id) {
        return await database_services_1.default.brands.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getAllBrand() {
        return await database_services_1.default.brands.find().toArray();
    }
}
exports.brandsServices = new BrandsServices();
