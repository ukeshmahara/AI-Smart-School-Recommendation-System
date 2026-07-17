"use server";

import { getChatHistoryApi, sendChatMessageApi, clearChatHistoryApi } from "../api/chatbot";

export async function handleGetChatHistory() {
    try {
        const response = await getChatHistoryApi();
        return { success: true, data: response.data as any[] };
    } catch (error: any) {
        return { success: false, data: [] as any[] };
    }
}

export async function handleSendChatMessage(message: string) {
    try {
        const response = await sendChatMessageApi(message);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to send message" };
    }
}

export async function handleClearChat() {
    try {
        const response = await clearChatHistoryApi();
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to clear chat" };
    }
}