"use server";

import {
    getNotificationsApi,
    createNotificationApi,
    deleteNotificationApi,
    CreateNotificationPayload,
} from "../../api/admin/notification";

export async function handleGetNotifications(page: number, limit: number) {
    try {
        const response = await getNotificationsApi(page, limit);
        return { success: true, data: response.data, meta: response.meta };
    } catch (error: any) {
        return { success: false, data: [], meta: { page: 1, limit, total: 0, totalPages: 1 } };
    }
}

export async function handleCreateNotification(payload: CreateNotificationPayload) {
    try {
        const response = await createNotificationApi(payload);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to send notification" };
    }
}

export async function handleDeleteNotification(id: string) {
    try {
        const response = await deleteNotificationApi(id);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to delete notification" };
    }
}