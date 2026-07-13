import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.get("/", authorizedMiddleware, notificationController.getRecent);

export default notificationRouter;