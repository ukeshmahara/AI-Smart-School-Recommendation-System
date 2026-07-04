import { Request, Response } from "express";
import { z } from "zod";
import { AdminSchoolService } from "../../services/admin/school.service";
import { CreateSchoolDTO, UpdateSchoolDTO } from "../../dtos/school.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminSchoolService = new AdminSchoolService();

export class AdminSchoolController {
    async createSchool(req: Request, res: Response) {
        try {
            const parsed = CreateSchoolDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const school = await adminSchoolService.createSchool(parsed.data, req.file);
            return ApiResponseHelper.success(res, school, "School created successfully", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateSchool(req: Request, res: Response) {
        try {
            const parsed = UpdateSchoolDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const school = await adminSchoolService.updateSchool(req.params.id, parsed.data, req.file);
            return ApiResponseHelper.success(res, school, "School updated successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteSchool(req: Request, res: Response) {
        try {
            await adminSchoolService.deleteSchool(req.params.id);
            return ApiResponseHelper.success(res, null, "School deleted successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}