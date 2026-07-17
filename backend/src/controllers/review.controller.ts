import { Request, Response } from "express";
import { z } from "zod";
import { ReviewService } from "../services/review.service";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";

const reviewService = new ReviewService();

export class ReviewController {
    async createReview(req: Request, res: Response) {
        try {
            const parsed = CreateReviewDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const studentId = (req.user as any)._id;
            const review = await reviewService.createReview(studentId, parsed.data);
            return ApiResponseHelper.success(res, review, "Review posted successfully", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getSchoolReviews(req: Request, res: Response) {
        try {
            const result = await reviewService.getSchoolReviews(req.params.schoolId);
            return ApiResponseHelper.success(res, result, "Reviews fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyReviews(req: Request, res: Response) {
        try {
            const studentId = (req.user as any)._id;
            const reviews = await reviewService.getMyReviews(studentId);
            return ApiResponseHelper.success(res, reviews, "Your reviews fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getTopRatedSchools(req: Request, res: Response) {
        try {
            const limit = Math.max(Number(req.query.limit) || 3, 1);
            const schools = await reviewService.getTopRatedSchools(limit);
            return ApiResponseHelper.success(res, schools, "Top rated schools fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateReview(req: Request, res: Response) {
        try {
            const parsed = UpdateReviewDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const studentId = (req.user as any)._id;
            const review = await reviewService.updateReview(req.params.id, studentId, parsed.data);
            return ApiResponseHelper.success(res, review, "Review updated successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            const studentId = (req.user as any)._id;
            await reviewService.deleteReview(req.params.id, studentId);
            return ApiResponseHelper.success(res, null, "Review deleted successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}