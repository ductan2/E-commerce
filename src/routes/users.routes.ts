import express from "express"
import { UpdateInfo } from "~/constants/type";
import {
  blockUserController, deleteUserController, forgotPasswordTokenController, getAllUserController, getUserController, loginController, logoutController,
  refreshTokenController, registerController, resetPasswordController, unBlockUserController, updatePasswordController, updateUserController
} from "~/controllers/users.controller";
import { authMiddlewares, isAdmin } from "~/middlewares/auth.middlewares";
import { filterMiddleware } from "~/middlewares/filter.middlewares";
import { ForgotPasswordValidator, LoginValidator, RegisterValidator, UpdatePasswordValidator, UpdateValidator } from "~/middlewares/users.middlewares";
import { validate } from "~/utils/validate";

const router = express.Router();

router.post("/register", validate(RegisterValidator), registerController)

router.post("/login", validate(LoginValidator), loginController)

router.get("/refresh-token", refreshTokenController)

router.get("/logout", logoutController)

router.post("/forgot-password-token", forgotPasswordTokenController)

router.put("/reset-password/:token", validate(ForgotPasswordValidator), resetPasswordController)

router.get("/reset-password/:token", (req, res) => {
  res.send("Page reset password")
})

router.post('/update-password', validate(UpdatePasswordValidator), authMiddlewares, updatePasswordController)

router.get("/get-all-user", authMiddlewares, isAdmin, getAllUserController)

router.get("/get-user/:id", authMiddlewares, isAdmin, getUserController)

router.patch("/update-user", authMiddlewares, validate(UpdateValidator), filterMiddleware<UpdateInfo>(["firstname", "lastname", "address", "mobile"]), updateUserController)

router.delete("/delete-user/:id", deleteUserController)

router.put('/block-user/:id', authMiddlewares, isAdmin, blockUserController)

router.put('/unblock-user/:id', authMiddlewares, isAdmin, unBlockUserController)


export default router