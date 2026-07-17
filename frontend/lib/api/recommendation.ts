import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface RecommendationPreferences {
    stream: "science" | "management" | "humanities";
    minFee: number;
    maxFee: number;
    location?: string;
    notes?: string;
}

export const getRecommendationsApi = async (preferences: RecommendationPreferences) => {
    const response = await axiosInstance.post(API.RECOMMENDATIONS, preferences);
    return response.data;
};