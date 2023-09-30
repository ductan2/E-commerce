"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadServices = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const dir_1 = require("../constants/dir");
const file_1 = require("../utils/file");
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../utils/cloudinary");
class UploadServices {
    async uploadImage(req) {
        const files = await (0, file_1.handleuploadImage)(req, dir_1.UPLOAD_IMAGE_TEMP_DIR);
        const urls = [];
        await Promise.all(files.map(async (file) => {
            const fileName = (0, file_1.getFileName)(file);
            const newPath = path_1.default.resolve(dir_1.UPLOAD_IMAGE_DIR, `${fileName}`);
            await (0, sharp_1.default)(file.filepath).jpeg().toFile(newPath);
            fs_1.default.unlink(file.filepath, (err) => {
                console.log(err);
            });
            urls.push(await (0, cloudinary_1.cloudinaryUploadImage)(newPath));
        }));
        return urls;
    }
}
exports.uploadServices = new UploadServices();
