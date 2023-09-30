"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryDeleteImage = exports.cloudinaryUploadImage = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinaryUploadImage = async (fileToUploads) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(fileToUploads, (error, result) => {
            if (error)
                return reject(error);
            resolve({ url: result.url, asset_id: result.asset_id, public_id: result.public_id });
        });
    });
};
exports.cloudinaryUploadImage = cloudinaryUploadImage;
const cloudinaryDeleteImage = async (fileToDelete) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.destroy(fileToDelete, (error, result) => {
            if (error)
                return reject(error);
            resolve({ url: result.url, asset_id: result.asset_id, public_id: result.public_id });
        });
    });
};
exports.cloudinaryDeleteImage = cloudinaryDeleteImage;
