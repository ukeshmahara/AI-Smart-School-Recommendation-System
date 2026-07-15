import { Router } from "express";
import { RecommendationController } from "../controllers/recommendation.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const recommendationRouter = Router();
const recommendationController = new RecommendationController();

recommendationRouter.post("/", authorizedMiddleware, recommendationController.getRecommendations);

export default recommendationRouter;