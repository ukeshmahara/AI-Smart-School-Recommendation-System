"use server";

import {
    getInquiriesApi,
    updateInquiryStatusApi,
    replyToInquiryApi,
    deleteInquiryApi,
} from "../../api/admin/inquiry";

export async function handleGetInquiries(page: number, limit: number) {
    try {
        const response = await getInquiriesApi(page, limit);
        return { success: true, data: response.data, meta: response.meta };
    } catch (error: any) {
        return { success: false, data: [], meta: { page: 1, limit, total: 0, totalPages: 1 } };
    }
}

export async function handleUpdateInquiryStatus(id: string, status: string) {
    try {
        const response = await updateInquiryStatusApi(id, status);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to update status" };
    }
}

export async function handleReplyToInquiry(id: string, adminReply: string) {
    try {
        const response = await replyToInquiryApi(id, adminReply);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to send reply" };
    }
}

export async function handleDeleteInquiry(id: string) {
    try {
        const response = await deleteInquiryApi(id);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to delete inquiry" };
    }
}