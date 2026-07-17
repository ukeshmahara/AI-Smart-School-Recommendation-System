import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export interface CreateNotificationPayload {
    title: string;
    message: string;
    type: "general" | "wish" | "important";
}

export const getNotificationsApi = async (page: number, limit: number) => {
    const response = await axiosInstance.get(API.ADMIN.NOTIFICATIONS, { params: { page, limit } });
    return response.data;
};

export const createNotificationApi = async (payload: CreateNotificationPayload) => {
    const response = await axiosInstance.post(API.ADMIN.NOTIFICATIONS, payload);
    return response.data;
};

export const deleteNotificationApi = async (id: string) => {
    const response = await axiosInstance.delete(`${API.ADMIN.NOTIFICATIONS}/${id}`);
    return response.data;
};