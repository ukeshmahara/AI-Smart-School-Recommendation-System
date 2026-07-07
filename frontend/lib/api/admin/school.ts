import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const createSchoolApi = async (formData: FormData) => {
    const response = await axiosInstance.post(API.ADMIN.SCHOOLS, formData);
    return response.data;
};

export const updateSchoolApi = async (id: string, formData: FormData) => {
    const response = await axiosInstance.patch(`${API.ADMIN.SCHOOLS}/${id}`, formData);
    return response.data;
};

export const deleteSchoolApi = async (id: string) => {
    const response = await axiosInstance.delete(`${API.ADMIN.SCHOOLS}/${id}`);
    return response.data;
};