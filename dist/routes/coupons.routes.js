"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupons_controller_1 = require("../controllers/coupons.controller");
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const coupons_middlewares_1 = require("../middlewares/coupons.middlewares");
const validate_1 = require("../utils/validate");
const router = express_1.default.Router();
router.post("/", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(coupons_middlewares_1.CouponsValidator), coupons_controller_1.createCouponController);
router.get("/get-all", auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, coupons_controller_1.getAllCouponsController);
router.patch('/:id', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, (0, validate_1.validate)(coupons_middlewares_1.updateCouponsValidator), coupons_controller_1.updateCouponController);
router.delete('/:id', auth_middlewares_1.authMiddlewares, auth_middlewares_1.isAdmin, coupons_controller_1.deleteCouponController);
exports.default = router;
