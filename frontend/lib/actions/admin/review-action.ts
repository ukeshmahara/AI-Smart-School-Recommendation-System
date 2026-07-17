"use server";

import { getReviewsApi, deleteReviewApi } from "../../api/admin/review";

export async function handleGetReviews(page: number, limit: number, rating?: number) {
    try {
        const response = await getReviewsApi(page, limit, rating);
        return { success: true, data: response.data, meta: response.meta };
    } catch (error: any) {
        return { success: false, data: [], meta: { page: 1, limit, total: 0, totalPages: 1 } };
    }
}

export async function handleDeleteReview(id: string) {
    try {
        const response = await deleteReviewApi(id);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to delete review" };
    }
}