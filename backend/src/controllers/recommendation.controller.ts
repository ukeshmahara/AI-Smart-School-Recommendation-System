import { Request, Response } from "express";
import { z } from "zod";
import { RecommendationService } from "../services/recommendation.service";
import { RecommendationPreferencesSchema } from "../types/recommendation.type";
import { ApiResponseHelper } from "../utils/apihelper.util";

const recommendationService = new RecommendationService();

export class RecommendationController {
    async getRecommendations(req: Request, res: Response) {
        try {
            const parsed = RecommendationPreferencesSchema.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const result = await recommendationService.getRecommendations(parsed.data);
            return ApiResponseHelper.success(res, result, "Recommendations generated successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}