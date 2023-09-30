"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumToArray = void 0;
const EnumToArray = (numberEnum) => {
    return Object.values(numberEnum).filter(value => typeof value === 'string');
};
exports.EnumToArray = EnumToArray;
