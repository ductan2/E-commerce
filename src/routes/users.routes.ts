import express from "express"
import { UpdateInfo } from "~/constants/type";
import {
  applyCouponController,
  blockUserController, deleteUserController, forgotPasswordTokenController, getAllUserController, getEmptyCartController, getUserCartController, getUserController, getWhishListController, loginAdminController, loginController, logoutController,
  refreshTokenController, registerController, resetPasswordController, unBlockUserController, updatePasswordController, updateUserController, userCartController
} from "~/controllers/users.controller";
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { ForgotPasswordValidator, LoginValidator, RegisterValidator, UpdatePasswordValidator, UpdateValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validate";

const router = express.Router();

router.post("/register", validate(RegisterValidator), registerController)

router.post("/login", validate(LoginValidator), loginController)

router.post('/login-admin', validate(LoginValidator), loginAdminController)

router.get("/refresh-token", refreshTokenController)

router.get("/logout", logoutController)

router.post("/forgot-password-token", forgotPasswordTokenController)

router.get("/reset-password/:token", (req, res) => {
  res.send("Page reset password")
})

router.post('/update-password', validate(UpdatePasswordValidator), authMiddlewares, updatePasswordController)

router.get("/get-all-user", authMiddlewares, isAdmin, getAllUserController)

router.patch("/update-user", authMiddlewares, validate(UpdateValidator), filterMiddleware<UpdateInfo>(["firstname", "lastname", "address", "mobile"]), updateUserController)

router.get('/whishlist', authMiddlewares, getWhishListController)

router.post('/cart', authMiddlewares, userCartController)

router.get('/get-cart', authMiddlewares, getUserCartController)

router.delete("/empty-cart", authMiddlewares, getEmptyCartController)

router.delete("/delete-user/:id", deleteUserController)

router.put("/reset-password/:token", validate(ForgotPasswordValidator), resetPasswordController)

router.get("/get-user/:id", authMiddlewares, isAdmin, getUserController)

router.patch("/apply-coupon", authMiddlewares, applyCouponController)

router.put('/block-user/:id', authMiddlewares, isAdmin, blockUserController)

router.put('/unblock-user/:id', authMiddlewares, isAdmin, unBlockUserController)


export default router