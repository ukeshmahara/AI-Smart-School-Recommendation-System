"use server";

import { createReviewApi, getSchoolReviewsApi, updateReviewApi, deleteReviewApi } from "../api/review";

export async function handleCreateReview(schoolId: string, rating: number, comment: string) {
    try {
        const response = await createReviewApi(schoolId, rating, comment);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to post review" };
    }
}

export async function handleGetSchoolReviews(schoolId: string) {
    try {
        const response = await getSchoolReviewsApi(schoolId);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, data: { reviews: [], summary: { average: 0, count: 0 } } };
    }
}

export async function handleUpdateReview(id: string, rating: number, comment: string) {
    try {
        const response = await updateReviewApi(id, rating, comment);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to update review" };
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