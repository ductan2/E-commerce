"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContactController = exports.getContactController = exports.deleteContactController = exports.updateContactController = exports.createContactController = void 0;
const contact_services_1 = require("../services/contact.services");
const createContactController = async (req, res) => {
    try {
        const result = await contact_services_1.contactServices.createContact(req.body);
        return res.status(200).json({ message: "Create Contact successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Create Contact failed", status: 400 });
    }
};
exports.createContactController = createContactController;
const updateContactController = async (req, res) => {
    try {
        const { id } = req.params;
        const { value } = await contact_services_1.contactServices.updateContact(id, req.body);
        return res.status(200).json({ message: "Update Contact successfully", status: 200, result: value });
    }
    catch (error) {
        return res.status(error.status || 400).json({ message: error.message || "Update Contact failed", status: error.status || 400 });
    }
};
exports.updateContactController = updateContactController;
const deleteContactController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await contact_services_1.contactServices.deleteContact(id);
        return res.status(200).json({ message: "Delete Contact successfully", status: 200, result });
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Delete Contact failed", status: 400 });
    }
};
exports.deleteContactController = deleteContactController;
const getContactController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await contact_services_1.contactServices.getContact(id);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get Contact failed", status: 400 });
    }
};
exports.getContactController = getContactController;
const getAllContactController = async (req, res) => {
    try {
        const result = await contact_services_1.contactServices.getAllContact();
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ message: error.message || "Get all Contact failed", status: 400 });
    }
};
exports.getAllContactController = getAllContactController;
