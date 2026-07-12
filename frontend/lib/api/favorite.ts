import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getFavoritesApi = async () => {
    const response = await axiosInstance.get(API.FAVORITES);
    return response.data;
};

export const addFavoriteApi = async (schoolId: string) => {
    const response = await axiosInstance.post(API.FAVORITES, { schoolId });
    return response.data;
};

export const removeFavoriteApi = async (schoolId: string) => {
    const response = await axiosInstance.delete(`${API.FAVORITES}/${schoolId}`);
    return response.data;
};