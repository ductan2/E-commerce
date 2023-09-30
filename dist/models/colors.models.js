"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = void 0;
const mongodb_1 = require("mongodb");
class Colors {
    constructor(color) {
        this._id = color._id || new mongodb_1.ObjectId();
        this.title = color.title;
        this.created_at = color.created_at || new Date();
        this.updated_at = color.updated_at || new Date();
    }
}
exports.Colors = Colors;
