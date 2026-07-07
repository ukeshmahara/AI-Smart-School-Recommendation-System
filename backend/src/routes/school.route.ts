import { Router } from "express";
import { SchoolController } from "../controllers/school.controller";

const schoolRouter = Router();
const schoolController = new SchoolController();

schoolRouter.get("/category-counts", schoolController.getCategoryCounts);
schoolRouter.get("/", schoolController.getSchools);
schoolRouter.get("/:id", schoolController.getSchoolById);

export default schoolRouter;