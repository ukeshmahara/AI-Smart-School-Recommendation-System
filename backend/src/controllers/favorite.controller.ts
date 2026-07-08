import { Request, Response } from "express";
import { z } from "zod";
import { FavoriteService } from "../services/favorite.service";
import { AddFavoriteDTO } from "../dtos/favorite.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";

const favoriteService = new FavoriteService();

export class FavoriteController {
    async addFavorite(req: Request, res: Response) {
        try {
            const parsed = AddFavoriteDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const userId = (req.user as any)._id;
            const favorite = await favoriteService.addFavorite(userId, parsed.data.schoolId);
            return ApiResponseHelper.success(res, favorite, "Added to favorites", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async removeFavorite(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id;
            await favoriteService.removeFavorite(userId, req.params.schoolId);
            return ApiResponseHelper.success(res, null, "Removed from favorites");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getFavorites(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id;
            const schools = await favoriteService.getUserFavorites(userId);
            return ApiResponseHelper.success(res, schools, "Favorites fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}