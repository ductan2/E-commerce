"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorWithStatus = void 0;
// CLASS
class ErrorWithStatus {
    constructor({ message, status }) {
        this.message = message;
        this.status = status;
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
