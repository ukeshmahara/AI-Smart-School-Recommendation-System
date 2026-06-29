import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface RegisterPayload {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export const registerUserApi = async (payload: RegisterPayload) => {
    const response = await axiosInstance.post(API.AUTH.REGISTER, payload);
    return response.data;
};

export const loginUserApi = async (payload: LoginPayload) => {
    const response = await axiosInstance.post(API.AUTH.LOGIN, payload);
    return response.data;
};

export const whoamiApi = async () => {
    const response = await axiosInstance.get(API.AUTH.WHOAMI);
    return response.data;
};