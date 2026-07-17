import { Router } from "express";
import { AdminReviewController } from "../../controllers/admin/review.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminReviewRouter = Router();
const adminReviewController = new AdminReviewController();

adminReviewRouter.use(authorizedMiddleware, adminMiddleware);

adminReviewRouter.get("/", adminReviewController.getReviews);
adminReviewRouter.delete("/:id", adminReviewController.deleteReview);

export default adminReviewRouter;