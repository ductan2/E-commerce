"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
router.get("/config", (req, res) => {
    return res.status(200).json({
        status: 'OK',
        data: process.env.PAYPAL_CLIENT_ID || 'sb'
    });
});
router.get("/success", (req, res) => {
});
exports.default = router;
