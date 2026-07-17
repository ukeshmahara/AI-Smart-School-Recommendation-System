"use server";

import { createInquiryApi, getMyInquiriesApi } from "../api/inquiry";

export async function handleCreateInquiry(schoolId: string, message: string) {
    try {
        const response = await createInquiryApi(schoolId, message);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to send inquiry" };
    }
}

export async function handleGetMyInquiries() {
    try {
        const response = await getMyInquiriesApi();
        return { success: true, data: response.data as any[] };
    } catch (error: any) {
        return { success: false, data: [] as any[] };
    }
}