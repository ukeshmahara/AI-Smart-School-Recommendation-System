import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { ApiResponseHelper } from "../utils/apihelper.util";

const notificationService = new NotificationService();

export class NotificationController {
    async getRecent(req: Request, res: Response) {
        try {
            const notifications = await notificationService.getRecentNotifications();
            return ApiResponseHelper.success(res, notifications, "Notifications fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}