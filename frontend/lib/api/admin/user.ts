import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export interface AdminUserPayload {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "student";
}

export interface AdminUserUpdatePayload {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    role?: "admin" | "student";
}

export const getUsersApi = async (page: number, limit: number, search: string) => {
    const response = await axiosInstance.get(API.ADMIN.USERS, {
        params: { page, limit, search: search || undefined },
    });
    return response.data;
};

export const getUserByIdApi = async (id: string) => {
    const response = await axiosInstance.get(`${API.ADMIN.USERS}/${id}`);
    return response.data;
};

export const createUserApi = async (payload: AdminUserPayload) => {
    const response = await axiosInstance.post(API.ADMIN.USERS, payload);
    return response.data;
};

export const updateUserApi = async (id: string, payload: AdminUserUpdatePayload) => {
    const response = await axiosInstance.patch(`${API.ADMIN.USERS}/${id}`, payload);
    return response.data;
};

export const deleteUserApi = async (id: string) => {
    const response = await axiosInstance.delete(`${API.ADMIN.USERS}/${id}`);
    return response.data;
};