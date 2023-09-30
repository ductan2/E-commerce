"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dir_1 = require("../constants/dir");
const upload_services_1 = require("../services/upload.services");
const cloudinary_1 = require("../utils/cloudinary");
const file_1 = require("../utils/file");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    (0, file_1.initFolder)(dir_1.UPLOAD_IMAGE_TEMP_DIR);
    try {
        const result = await upload_services_1.uploadServices.uploadImage(req);
        return res.status(200).json({ message: "Upload image successfully", status: 200, result });
    }
    catch (error) {
        return res.json({ message: "Upload image failed", status: 400 });
    }
});
router.delete('/delete-image/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const uploader = (0, cloudinary_1.cloudinaryDeleteImage)(id);
        return res.json({ message: "Delete image successfully", status: 200 });
    }
    catch (error) {
        return res.json(500).json({ message: "Delete image failed", status: 500 });
    }
});
exports.default = router;
