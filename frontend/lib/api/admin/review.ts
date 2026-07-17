import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getReviewsApi = async (page: number, limit: number, rating?: number) => {
    const response = await axiosInstance.get(API.ADMIN.REVIEWS, { params: { page, limit, rating } });
    return response.data;
};

export const deleteReviewApi = async (id: string) => {
    const response = await axiosInstance.delete(`${API.ADMIN.REVIEWS}/${id}`);
    return response.data;
};