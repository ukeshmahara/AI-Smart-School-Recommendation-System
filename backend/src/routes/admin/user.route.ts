import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminUserRouter = Router();
const adminUserController = new AdminUserController();

adminUserRouter.use(authorizedMiddleware, adminMiddleware);

adminUserRouter.get("/", adminUserController.getUsers);
adminUserRouter.get("/:id", adminUserController.getUserById);
adminUserRouter.post("/", adminUserController.createUser);
adminUserRouter.patch("/:id", adminUserController.updateUser);
adminUserRouter.put("/:id", adminUserController.updateUser);
adminUserRouter.delete("/:id", adminUserController.deleteUser);

export default adminUserRouter;