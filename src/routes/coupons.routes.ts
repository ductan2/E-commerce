import express from "express"
import { createCouponController, deleteCouponController, getAllCouponsController, updateCouponController } from "~/controllers/coupons.controller"
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares";
import { CouponsValidator, updateCouponsValidator } from "~/middlewares/coupons.middlewares";
import { validate } from "~/utils/validate";

const router = express.Router()

router.post("/", authMiddlewares, isAdmin, validate(CouponsValidator), createCouponController);
router.get("/get-all", authMiddlewares, isAdmin, getAllCouponsController);
router.patch('/:id', authMiddlewares, isAdmin, validate(updateCouponsValidator), updateCouponController);
router.delete('/:id', authMiddlewares, isAdmin, deleteCouponController);

export default router;