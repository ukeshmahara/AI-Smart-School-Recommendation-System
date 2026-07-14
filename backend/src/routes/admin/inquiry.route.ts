import { Router } from "express";
import { AdminInquiryController } from "../../controllers/admin/inquiry.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";

const adminInquiryRouter = Router();
const adminInquiryController = new AdminInquiryController();

adminInquiryRouter.use(authorizedMiddleware, adminMiddleware);

adminInquiryRouter.get("/", adminInquiryController.getInquiries);
adminInquiryRouter.patch("/:id/status", adminInquiryController.updateStatus);
adminInquiryRouter.patch("/:id/reply", adminInquiryController.replyToInquiry);
adminInquiryRouter.delete("/:id", adminInquiryController.deleteInquiry);

export default adminInquiryRouter;