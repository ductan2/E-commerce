"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusContact = exports.statusOrder = exports.ErrorStatus = void 0;
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ErrorStatus[ErrorStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorStatus[ErrorStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorStatus[ErrorStatus["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    ErrorStatus[ErrorStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ErrorStatus[ErrorStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
})(ErrorStatus || (exports.ErrorStatus = ErrorStatus = {}));
var statusOrder;
(function (statusOrder) {
    statusOrder["CASH_ON_DELIVERY"] = "Cash on delivery";
    statusOrder["PROCESSING"] = "Processing";
    statusOrder["CANCELLED"] = "Cancelled";
    statusOrder["DELIVERED"] = "Delivered";
})(statusOrder || (exports.statusOrder = statusOrder = {}));
var statusContact;
(function (statusContact) {
    statusContact["IN_PROCESSED"] = "In processed";
    statusContact["SUBMITTED"] = "Submitted";
    statusContact["CONTACTED"] = "Contacted";
})(statusContact || (exports.statusContact = statusContact = {}));
