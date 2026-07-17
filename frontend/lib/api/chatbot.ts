import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getChatHistoryApi = async () => {
    const response = await axiosInstance.get(API.CHATBOT);
    return response.data;
};

export const sendChatMessageApi = async (message: string) => {
    const response = await axiosInstance.post(API.CHATBOT, { message });
    return response.data;
};

export const clearChatHistoryApi = async () => {
    const response = await axiosInstance.delete(API.CHATBOT);
    return response.data;
};