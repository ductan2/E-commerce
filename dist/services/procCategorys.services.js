"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procCategorysServices = void 0;
const procCategorys_models_1 = __importDefault(require("../models/procCategorys.models"));
const database_services_1 = __importDefault(require("./database.services"));
const mongodb_1 = require("mongodb");
const type_1 = require("../constants/type");
class ProcCategorysServices {
    async createProcCategory(payload) {
        return await database_services_1.default.productCategorys.insertOne(new procCategorys_models_1.default({ ...payload }));
    }
    async updateProcCategory(id, payload) {
        const result = await database_services_1.default.productCategorys.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(id)
        }, {
            $set: {
                ...payload, updated_at: new Date()
            }
        }, { returnDocument: "after" });
        if (result.value === null)
            throw new type_1.ErrroWithStatus({ message: "BlogCategory does not exits!", status: 404 });
        return result;
    }
    async deleteProcCategory(id) {
        return await database_services_1.default.productCategorys.deleteOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getProcCategory(id) {
        return await database_services_1.default.productCategorys.findOne({
            _id: new mongodb_1.ObjectId(id)
        });
    }
    async getAllProcCategory() {
        return await database_services_1.default.productCategorys.find().sort({ title: 1 }).toArray();
    }
}
exports.procCategorysServices = new ProcCategorysServices();
