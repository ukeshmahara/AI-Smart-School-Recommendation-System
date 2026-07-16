import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const createReviewApi = async (schoolId: string, rating: number, comment: string) => {
    const response = await axiosInstance.post(API.REVIEWS, { schoolId, rating, comment });
    return response.data;
};

export const getSchoolReviewsApi = async (schoolId: string) => {
    const response = await axiosInstance.get(`${API.REVIEWS}/school/${schoolId}`);
    return response.data;
};

export const updateReviewApi = async (id: string, rating: number, comment: string) => {
    const response = await axiosInstance.patch(`${API.REVIEWS}/${id}`, { rating, comment });
    return response.data;
};

export const deleteReviewApi = async (id: string) => {
    const response = await axiosInstance.delete(`${API.REVIEWS}/${id}`);
    return response.data;
};