import { Router } from "express";
import { AdminSchoolController } from "../../controllers/admin/school.controller";
import { authorizedMiddleware, adminMiddleware } from "../../middlewares/authorized.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";

const adminSchoolRouter = Router();
const adminSchoolController = new AdminSchoolController();

adminSchoolRouter.use(authorizedMiddleware, adminMiddleware);

adminSchoolRouter.post("/", uploadMiddleware.single("image"), adminSchoolController.createSchool);
adminSchoolRouter.patch("/:id", uploadMiddleware.single("image"), adminSchoolController.updateSchool);
adminSchoolRouter.put("/:id", uploadMiddleware.single("image"), adminSchoolController.updateSchool);
adminSchoolRouter.delete("/:id", adminSchoolController.deleteSchool);

export default adminSchoolRouter;