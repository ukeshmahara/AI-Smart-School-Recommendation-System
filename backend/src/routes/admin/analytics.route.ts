import { Router } from "express";
import { AdminAnalyticsController } from "../../controllers/admin/analytics.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminAnalyticsRouter = Router();
const adminAnalyticsController = new AdminAnalyticsController();

adminAnalyticsRouter.use(authorizedMiddleware, adminMiddleware);
adminAnalyticsRouter.get("/", adminAnalyticsController.getDashboardStats);

export default adminAnalyticsRouter;