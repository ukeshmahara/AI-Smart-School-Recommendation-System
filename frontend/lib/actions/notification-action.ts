"use server";

import { getRecentNotificationsApi } from "../api/notification";

export async function handleGetRecentNotifications() {
    try {
        const response = await getRecentNotificationsApi();
        return { success: true, data: response.data as any[] };
    } catch (error: any) {
        return { success: false, data: [] as any[] };
    }
}