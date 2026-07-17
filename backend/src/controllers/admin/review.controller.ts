import { Request, Response } from "express";
import { AdminReviewService } from "../../services/admin/review.service";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminReviewService = new AdminReviewService();

export class AdminReviewController {
    async getReviews(req: Request, res: Response) {
        try {
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 10, 1);
            const ratingFilter = req.query.rating ? Number(req.query.rating) : undefined;
            const { reviews, meta } = await adminReviewService.getReviews(page, limit, ratingFilter);
            return ApiResponseHelper.success(res, reviews, "Reviews fetched successfully", 200, meta);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            await adminReviewService.deleteReview(req.params.id);
            return ApiResponseHelper.success(res, null, "Review deleted successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}