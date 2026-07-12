import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getDashboardStatsApi = async () => {
    const response = await axiosInstance.get(API.ADMIN.ANALYTICS);
    return response.data;
};