"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProcCategoryController = exports.getProcCategoryController = exports.deleteProcCategoryController = exports.updateProcCategoryController = exports.createProcCategoryController = void 0;
const procCategorys_services_1 = require("../services/procCategorys.services");
const createProcCategoryController = async (req, res) => {
    try {
        const result = await procCategorys_services_1.procCategorysServices.createProcCategory(req.body);
        return res.status(200).json({ message: "Create ProcCategory successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Create ProcCategory failed", status: 400 });
    }
};
exports.createProcCategoryController = createProcCategoryController;
const updateProcCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await procCategorys_services_1.procCategorysServices.updateProcCategory(id, req.body);
        return res.status(200).json({ message: "Update ProcCategory successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(error.status || 400).json({ message: error.message || "Update Color failed", status: error.status || 400 });
    }
};
exports.updateProcCategoryController = updateProcCategoryController;
const deleteProcCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await procCategorys_services_1.procCategorysServices.deleteProcCategory(id);
        return res.status(200).json({ message: "Delete ProcCategory successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Delete ProcCategory failed", status: 400 });
    }
};
exports.deleteProcCategoryController = deleteProcCategoryController;
const getProcCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await procCategorys_services_1.procCategorysServices.getProcCategory(id);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get ProcCategory failed", status: 400 });
    }
};
exports.getProcCategoryController = getProcCategoryController;
const getAllProcCategoryController = async (req, res) => {
    try {
        const result = await procCategorys_services_1.procCategorysServices.getAllProcCategory();
        return res.status(200).json({ message: "Get ProcCategory successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get all ProcCategory failed", status: 400 });
    }
};
exports.getAllProcCategoryController = getAllProcCategoryController;
