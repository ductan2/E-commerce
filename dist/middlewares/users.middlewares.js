"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusOrderValidator = exports.ForgotPasswordValidator = exports.UpdateValidator = exports.UpdatePasswordValidator = exports.LoginValidator = exports.RegisterValidator = void 0;
const express_validator_1 = require("express-validator");
const enum_1 = require("../constants/enum");
const database_services_1 = __importDefault(require("../services/database.services"));
const commons_1 = require("../utils/commons");
const statusOrdersType = (0, commons_1.EnumToArray)(enum_1.statusOrder);
const passwordSchema = {
    notEmpty: true,
    isLength: {
        options: {
            min: 6,
            max: 25,
        }
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
        },
        errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
    }
};
const confirmPasswordSchema = {
    notEmpty: true,
    isLength: {
        options: {
            min: 6,
            max: 25,
        }
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 0
        },
        errorMessage: "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one digit."
    },
    custom: {
        options: ((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password does not match password!");
            }
            return true;
        })
    }
};
exports.RegisterValidator = (0, express_validator_1.checkSchema)({
    firstname: {
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 25,
            },
            errorMessage: "First name must be at least 2 characters long and less than 25 characters long."
        },
    },
    lastname: {
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 25,
            },
            errorMessage: "Last name must be at least 2 characters long and less than 25 characters long."
        },
    },
    email: {
        notEmpty: true,
        isEmail: {
            errorMessage: "Email is invalid",
        },
        trim: true,
        custom: {
            options: (async (value) => {
                const isCheck = await database_services_1.default.users.findOne({ email: value });
                if (isCheck) {
                    throw new Error("Email already exists!");
                }
            })
        }
    },
    mobile: {
        notEmpty: true,
        isMobilePhone: true,
        trim: true,
    },
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema
}, ["body"]);
exports.LoginValidator = (0, express_validator_1.checkSchema)({
    email: {
        notEmpty: true,
        isEmail: {
            errorMessage: "Email is invalid",
        },
        trim: true,
        custom: {
            options: (async (value) => {
                const isCheck = await database_services_1.default.users.findOne({ email: value });
                if (!isCheck) {
                    throw new Error("Email does not exits!");
                }
            })
        }
    },
    password: passwordSchema,
}, ["body"]);
exports.UpdatePasswordValidator = (0, express_validator_1.checkSchema)({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: {
        ...confirmPasswordSchema,
        custom: {
            options: ((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error("Confirm password does not match password!");
                }
                return true;
            })
        }
    }
}, ["body"]);
exports.UpdateValidator = (0, express_validator_1.checkSchema)({
    firstname: {
        optional: true,
        isString: {
            errorMessage: "Bio must be string"
        },
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 25,
            },
            errorMessage: "First name must be at least 2 characters long and less than 25 characters long."
        },
    },
    lastname: {
        optional: true,
        isString: {
            errorMessage: "Bio must be string"
        },
        trim: true,
        isLength: {
            options: {
                min: 2,
                max: 25,
            },
            errorMessage: "Last name must be at least 2 characters long and less than 25 characters long."
        },
    },
    mobile: {
        optional: true,
        isMobilePhone: true,
        trim: true,
    },
}, ["body"]);
exports.ForgotPasswordValidator = (0, express_validator_1.checkSchema)({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema
}, ["body"]);
exports.StatusOrderValidator = (0, express_validator_1.checkSchema)({
    status: {
        notEmpty: true,
        isString: {
            errorMessage: "Status must be string"
        },
        trim: true,
        isIn: {
            options: [statusOrdersType],
            errorMessage: `Status must be ${statusOrdersType.join(", ")}`
        }
    }
}, ["body"]);
