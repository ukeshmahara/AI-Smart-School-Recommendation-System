import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getInquiriesApi = async (page: number, limit: number) => {
    const response = await axiosInstance.get(API.ADMIN.INQUIRIES, { params: { page, limit } });
    return response.data;
};

export const updateInquiryStatusApi = async (id: string, status: string) => {
    const response = await axiosInstance.patch(`${API.ADMIN.INQUIRIES}/${id}/status`, { status });
    return response.data;
};

export const replyToInquiryApi = async (id: string, adminReply: string) => {
    const response = await axiosInstance.patch(`${API.ADMIN.INQUIRIES}/${id}/reply`, { adminReply });
    return response.data;
};

export const deleteInquiryApi = async (id: string) => {
    const response = await axiosInstance.delete(`${API.ADMIN.INQUIRIES}/${id}`);
    return response.data;
};