import express from "express"
import { UpdateInfo } from "~/constants/type";
import {
  applyCouponController,
  blockUserController, createOrderController, deleteAddressUserController, deleteUserController, forgotPasswordTokenController, getAllUserController, getEmptyCartController, getInfoTokenController, getOrderByUserController, getOrderController, getUserCartController, getUserController, getWishListController, loginAdminController, loginController, logoutController,
  oauthController,
  refreshTokenController, registerController, resetPasswordController, unBlockUserController, updateAddressUserController, updateCartQuantityController, updateOrderStatusController, updatePasswordController, updateUserController, userAddCartController
} from "~/controllers/users.controller";
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { ForgotPasswordValidator, LoginValidator, RegisterValidator, StatusOrderValidator, UpdatePasswordValidator, UpdateValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validate";
import { deleteCartController } from "../controllers/users.controller";
import { CartType } from "~/models/carts.models";

const router = express.Router();

router.post("/register", validate(RegisterValidator), registerController)

router.post("/login", validate(LoginValidator), loginController)

router.post('/login-admin', loginAdminController)

router.get("/info", authMiddlewares, getInfoTokenController)

router.get("/refresh-token", refreshTokenController)

router.get("/logout", authMiddlewares, logoutController)

router.post("/forgot-password-token", forgotPasswordTokenController)


router.get("/reset-password/:token", (req, res) => {
  res.send("Page reset password")
})

router.post('/update-password', validate(UpdatePasswordValidator), authMiddlewares, updatePasswordController)

router.get("/get-all-user", authMiddlewares, isAdmin, getAllUserController)

router.patch("/update-user", authMiddlewares, validate(UpdateValidator), filterMiddleware<UpdateInfo>(["firstname", "lastname", "address", "mobile", "avatar", "admin"]), updateUserController)

router.get('/wishlist', authMiddlewares, getWishListController)

router.post('/cart', authMiddlewares, userAddCartController)

router.get('/login-google', oauthController)

router.patch("/apply-coupon", authMiddlewares, applyCouponController)

router.put('/update-user-address/:id_address', authMiddlewares, filterMiddleware<UpdateInfo>(["address"]), updateAddressUserController)

router.delete('/delete-user-address/:id_address', authMiddlewares, deleteAddressUserController)

router.get('/cart/get-cart', authMiddlewares, getUserCartController)

router.delete('/cart/delete-cart/:cart_id', authMiddlewares, deleteCartController)

router.post('/order/cash-order', authMiddlewares, createOrderController)

router.get('/order/get-order', authMiddlewares, getOrderByUserController)

router.get('/order/get-order/:order_id', authMiddlewares, getOrderController)


router.put('/order/update-status-order/:cart_id', authMiddlewares, isAdmin, validate(StatusOrderValidator), updateOrderStatusController)

router.put('/cart/update-cart/:cart_id', authMiddlewares, filterMiddleware<CartType>(["amount"]), updateCartQuantityController)

router.delete("/cart/empty-cart", authMiddlewares, getEmptyCartController)

router.delete("/delete-user/:id", deleteUserController)

router.put("/reset-password/:token", validate(ForgotPasswordValidator), resetPasswordController)

router.get("/get-user/:id", authMiddlewares, isAdmin, getUserController)

router.put('/block-user/:id', authMiddlewares, isAdmin, blockUserController)

router.put('/unblock-user/:id', authMiddlewares, isAdmin, unBlockUserController)



export default router