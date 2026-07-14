import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/whoami", authorizedMiddleware, userController.whoami);
userRouter.patch(
    "/update",
    authorizedMiddleware,
    uploadMiddleware.single("profileImage"),
    userController.updateUser
);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post("/reset-password/:token", userController.resetPassword);

export default userRouter;