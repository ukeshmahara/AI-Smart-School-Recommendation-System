import { Router } from "express";
import { InquiryController } from "../controllers/inquiry.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const inquiryRouter = Router();
const inquiryController = new InquiryController();

inquiryRouter.use(authorizedMiddleware);

inquiryRouter.post("/", inquiryController.createInquiry);
inquiryRouter.get("/my", inquiryController.getMyInquiries);

export default inquiryRouter;