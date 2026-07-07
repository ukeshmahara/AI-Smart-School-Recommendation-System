import { Request, Response } from "express";
import { SchoolService } from "../services/school.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const schoolService = new SchoolService();

export class SchoolController {
    async getSchools(req: Request, res: Response) {
        try {
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 10, 1);
            const search = (req.query.search as string) || "";
            const category = (req.query.category as string) || "";
            const stream = (req.query.stream as string) || "";

            const { schools, meta } = await schoolService.getSchools(page, limit, search, category, stream);
            return ApiResponseHelper.success(res, schools, "Schools fetched successfully", 200, meta);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getSchoolById(req: Request, res: Response) {
        try {
            const school = await schoolService.getSchoolById(req.params.id);
            return ApiResponseHelper.success(res, school, "School fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getCategoryCounts(req: Request, res: Response) {
        try {
            const counts = await schoolService.getCategoryCounts();
            return ApiResponseHelper.success(res, counts, "Category counts fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}