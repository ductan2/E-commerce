"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllColorsController = exports.getColorsController = exports.deleteColorsController = exports.updateColorsController = exports.createColorsController = void 0;
const colors_services_1 = require("../services/colors.services");
const createColorsController = async (req, res) => {
    try {
        const result = await colors_services_1.colorsServices.createColors(req.body);
        return res.status(200).json({ message: "Create Colors successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Create Colors failed", status: 400 });
    }
};
exports.createColorsController = createColorsController;
const updateColorsController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await colors_services_1.colorsServices.updateColors(id, req.body);
        return res.status(200).json({ message: "Update Colors successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 });
    }
};
exports.updateColorsController = updateColorsController;
const deleteColorsController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await colors_services_1.colorsServices.deleteColors(id);
        return res.status(200).json({ message: "Delete Colors successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Delete Colors failed", status: 400 });
    }
};
exports.deleteColorsController = deleteColorsController;
const getColorsController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await colors_services_1.colorsServices.getColors(id);
        return res.status(200).json({ message: "Get a color successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get Colors failed", status: 400 });
    }
};
exports.getColorsController = getColorsController;
const getAllColorsController = async (req, res) => {
    try {
        const result = await colors_services_1.colorsServices.getAllColors();
        return res.status(200).json({ message: "Get all Colors successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get all Colors failed", status: 400 });
    }
};
exports.getAllColorsController = getAllColorsController;
