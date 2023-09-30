"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorsServices = void 0;
const colors_models_1 = require("../models/colors.models");
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
class ColorsServices {
    async createColors(payload) {
        return await database_services_1.default.colors.insertOne(new colors_models_1.Colors({ ...payload }));
    }
    async updateColors(id, payload) {
        const result = await database_services_1.default.colors.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(id)
        }, {
            $set: {
                ...payload, updated_at: new Date()
            }
        }, { returnDocument: "after" });
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "Colors does not exits!", status: 404 });
        return result;
    }
    async deleteColors(id) {
        return await database_services_1.default.colors.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getColors(id) {
        return await database_services_1.default.colors.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getAllColors() {
        return await database_services_1.default.colors.find().toArray();
    }
}
exports.colorsServices = new ColorsServices();
