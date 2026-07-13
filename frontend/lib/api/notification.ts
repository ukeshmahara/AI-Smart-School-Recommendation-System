import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getRecentNotificationsApi = async () => {
    const response = await axiosInstance.get(API.NOTIFICATIONS);
    return response.data;
};