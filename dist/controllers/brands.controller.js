"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBrandController = exports.getBrandController = exports.deleteBrandController = exports.updateBrandController = exports.uploadImageBrandController = exports.createBrandController = void 0;
const dir_1 = require("../constants/dir");
const enum_1 = require("../constants/enum");
const brand_services_1 = require("../services/brand.services");
const file_1 = require("../utils/file");
const createBrandController = async (req, res) => {
    try {
        const result = await brand_services_1.brandsServices.createBrand(req.body);
        return res.status(200).json({ message: "Create Brand successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Create Brand failed", status: 400 });
    }
};
exports.createBrandController = createBrandController;
const uploadImageBrandController = async (req, res) => {
    (0, file_1.initFolder)(dir_1.UPLOAD_IMAGE_BRAND_TEMP_DIR);
    try {
        const { value } = await brand_services_1.brandsServices.uploadImage(req);
        return res.status(200).json({ message: "Upload image successfully", status: 200, result: value });
    }
    catch (error) {
        return res.json(enum_1.ErrorStatus.INTERNAL_SERVER).json({ message: "Upload image failed", status: enum_1.ErrorStatus.INTERNAL_SERVER });
    }
};
exports.uploadImageBrandController = uploadImageBrandController;
const updateBrandController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await brand_services_1.brandsServices.updateBrand(id, req.body);
        console.log("Hàm this");
        return res.status(200).json({ message: "Update Brand successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 });
    }
};
exports.updateBrandController = updateBrandController;
const deleteBrandController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await brand_services_1.brandsServices.deleteBrand(id);
        return res.status(200).json({ message: "Delete Brand successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Delete Brand failed", status: 400 });
    }
};
exports.deleteBrandController = deleteBrandController;
const getBrandController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await brand_services_1.brandsServices.getBrand(id);
        return res.status(200).json({ message: "Get brand successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get Brand failed", status: 400 });
    }
};
exports.getBrandController = getBrandController;
const getAllBrandController = async (req, res) => {
    try {
        const result = await brand_services_1.brandsServices.getAllBrand();
        return res.status(200).json({ message: "Get all brand successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get all Brand failed", status: 400 });
    }
};
exports.getAllBrandController = getAllBrandController;
