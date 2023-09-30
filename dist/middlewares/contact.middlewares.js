"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactSchema = exports.contactSchema = void 0;
const express_validator_1 = require("express-validator");
const enum_1 = require("../constants/enum");
const database_services_1 = __importDefault(require("../services/database.services"));
const commons_1 = require("../utils/commons");
const statusContactType = (0, commons_1.EnumToArray)(enum_1.statusContact);
exports.contactSchema = (0, express_validator_1.checkSchema)({
    name: {
        notEmpty: true,
        trim: true,
        isString: true,
        errorMessage: "Name is required"
    },
    email: {
        notEmpty: true,
        trim: true,
        isEmail: true,
        errorMessage: "Email is invalid",
        custom: {
            options: (async (value) => {
                const isExits = await database_services_1.default.users.findOne({ email: value });
                if (!isExits)
                    throw new Error("Email does not exits!");
                return true;
            })
        }
    },
    phone: {
        notEmpty: true,
        trim: true,
    },
    message: {
        notEmpty: true,
        trim: true,
    },
    status: {
        optional: true,
        trim: true,
        isIn: {
            options: [statusContactType],
        },
    }
}, ["body"]);
exports.updateContactSchema = (0, express_validator_1.checkSchema)({
    name: {
        optional: true,
        trim: true,
        isString: true,
        errorMessage: "Name is required"
    },
    email: {
        optional: true,
        trim: true,
        isEmail: true,
        errorMessage: "Email is invalid",
        custom: {
            options: (async (value) => {
                const isExits = await database_services_1.default.users.findOne({ email: value });
                if (!isExits)
                    throw new Error("Email does not exits!");
                return true;
            })
        }
    },
    phone: {
        optional: true,
        trim: true,
    },
    message: {
        optional: true,
        trim: true,
    },
    status: {
        optional: true,
        trim: true,
        isIn: {
            options: [statusContactType],
        },
    }
}, ["body"]);
