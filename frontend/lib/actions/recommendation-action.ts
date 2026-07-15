"use server";

import { getRecommendationsApi, RecommendationPreferences } from "../api/recommendation";

export async function handleGetRecommendations(preferences: RecommendationPreferences) {
    try {
        const response = await getRecommendationsApi(preferences);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to generate recommendations" };
    }
}