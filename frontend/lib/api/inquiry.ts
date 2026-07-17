import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const createInquiryApi = async (schoolId: string, message: string) => {
    const response = await axiosInstance.post(API.INQUIRIES, { schoolId, message });
    return response.data;
};

export const getMyInquiriesApi = async () => {
    const response = await axiosInstance.get(`${API.INQUIRIES}/my`);
    return response.data;
};