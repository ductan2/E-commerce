"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactServices = void 0;
const contact_models_1 = require("../models/contact.models");
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
class ContactServices {
    async createContact(payload) {
        return await database_services_1.default.contact.insertOne(new contact_models_1.Contact({ ...payload }));
    }
    async updateContact(id, payload) {
        const result = await database_services_1.default.contact.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(id)
        }, {
            $set: {
                ...payload, updated_at: new Date()
            }
        }, { returnDocument: "after" });
        console.log("🚀 ~ file: contact.services.ts:19 ~ ContactServices ~ updateContact ~ result:", result);
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "Contact does not exits!", status: 404 });
        return result;
    }
    async deleteContact(id) {
        return await database_services_1.default.contact.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getContact(id) {
        return await database_services_1.default.contact.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getAllContact() {
        return await database_services_1.default.contact.find().toArray();
    }
}
exports.contactServices = new ContactServices();
