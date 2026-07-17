import { Router } from "express";
import { ChatbotController } from "../controllers/chatbot.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const chatbotRouter = Router();
const chatbotController = new ChatbotController();

chatbotRouter.use(authorizedMiddleware);

chatbotRouter.get("/", chatbotController.getHistory);
chatbotRouter.post("/", chatbotController.sendMessage);
chatbotRouter.delete("/", chatbotController.clearHistory);

export default chatbotRouter;