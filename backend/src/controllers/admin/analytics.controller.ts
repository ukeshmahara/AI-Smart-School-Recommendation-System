import { Request, Response } from "express";
import { AdminAnalyticsService } from "../../services/admin/analytics.service";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminAnalyticsService = new AdminAnalyticsService();

export class AdminAnalyticsController {
    async getDashboardStats(req: Request, res: Response) {
        try {
            const stats = await adminAnalyticsService.getDashboardStats();
            return ApiResponseHelper.success(res, stats, "Analytics fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}