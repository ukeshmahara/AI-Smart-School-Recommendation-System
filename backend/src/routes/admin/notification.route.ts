import { Router } from "express";
import { AdminNotificationController } from "../../controllers/admin/notification.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminNotificationRouter = Router();
const adminNotificationController = new AdminNotificationController();

adminNotificationRouter.use(authorizedMiddleware, adminMiddleware);

adminNotificationRouter.get("/", adminNotificationController.getNotifications);
adminNotificationRouter.post("/", adminNotificationController.createNotification);
adminNotificationRouter.delete("/:id", adminNotificationController.deleteNotification);

export default adminNotificationRouter;