"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorRefreshToken = exports.generatorToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generatorToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
exports.generatorToken = generatorToken;
const generatorRefreshToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
};
exports.generatorRefreshToken = generatorRefreshToken;
