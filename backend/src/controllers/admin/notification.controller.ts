import { Request, Response } from "express";
import { z } from "zod";
import { AdminNotificationService } from "../../services/admin/notification.service";
import { CreateNotificationDTO } from "../../dtos/notification.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminNotificationService = new AdminNotificationService();

export class AdminNotificationController {
    async createNotification(req: Request, res: Response) {
        try {
            const parsed = CreateNotificationDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const createdBy = (req.user as any)._id;
            const notification = await adminNotificationService.createNotification(parsed.data, createdBy);
            return ApiResponseHelper.success(res, notification, "Notification sent successfully", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteNotification(req: Request, res: Response) {
        try {
            await adminNotificationService.deleteNotification(req.params.id);
            return ApiResponseHelper.success(res, null, "Notification deleted successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getNotifications(req: Request, res: Response) {
        try {
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 10, 1);
            const { notifications, meta } = await adminNotificationService.getNotifications(page, limit);
            return ApiResponseHelper.success(res, notifications, "Notifications fetched successfully", 200, meta);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}