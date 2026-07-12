"use server";

import { getDashboardStatsApi } from "../../api/admin/analytics";

export async function handleGetDashboardStats() {
    try {
        const response = await getDashboardStatsApi();
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, data: null };
    }
}