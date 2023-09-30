"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
// sequential processing, stops running validations chain if the previous one fails.
const validate = (validation) => {
    return async (req, res, next) => {
        await validation.run(req);
        const errorValidation = (0, express_validator_1.validationResult)(req);
        if (errorValidation.isEmpty()) {
            return next();
        }
        const arrayError = errorValidation.mapped();
        const simplifiedErrors = [];
        for (const key in arrayError) {
            simplifiedErrors.push({
                message: arrayError[key].msg.message || arrayError[key].msg,
                path: arrayError[key].path,
                status: arrayError[key].msg.status || 400
            });
        }
        res.status(400).json(simplifiedErrors);
    };
};
exports.validate = validate;
