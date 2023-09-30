"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hassPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hassPassword = (password) => {
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const hash = bcrypt_1.default.hashSync(password, salt);
    return hash;
};
exports.hassPassword = hassPassword;
const checkPassword = (plaintext, hash) => {
    return bcrypt_1.default.compareSync(plaintext, hash);
};
exports.checkPassword = checkPassword;
