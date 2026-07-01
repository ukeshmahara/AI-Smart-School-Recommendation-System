import { Request, Response } from "express";
import { z } from "zod";
import { AdminUserService } from "../../services/admin/user.service";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../../dtos/admin/user.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminUserService = new AdminUserService();

export class AdminUserController {
    async getUsers(req: Request, res: Response) {
        try {
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 10, 1);
            const search = (req.query.search as string) || "";

            const { users, meta } = await adminUserService.getUsers(page, limit, search);
            return ApiResponseHelper.success(res, users, "Users fetched successfully", 200, meta);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await adminUserService.getUserById(req.params.id);
            return ApiResponseHelper.success(res, user, "User fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const parsed = AdminCreateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const user = await adminUserService.createUser(parsed.data);
            return ApiResponseHelper.success(res, user, "User created successfully", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const parsed = AdminUpdateUserDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const user = await adminUserService.updateUser(req.params.id, parsed.data);
            return ApiResponseHelper.success(res, user, "User updated successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const requestingAdminId = (req.user as any)._id;
            await adminUserService.deleteUser(req.params.id, requestingAdminId);
            return ApiResponseHelper.success(res, null, "User deleted successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}