import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.use(authorizedMiddleware);

reviewRouter.post("/", reviewController.createReview);
reviewRouter.get("/top-schools", reviewController.getTopRatedSchools);
reviewRouter.get("/school/:schoolId", reviewController.getSchoolReviews);
reviewRouter.get("/my", reviewController.getMyReviews);
reviewRouter.patch("/:id", reviewController.updateReview);
reviewRouter.delete("/:id", reviewController.deleteReview);

export default reviewRouter;