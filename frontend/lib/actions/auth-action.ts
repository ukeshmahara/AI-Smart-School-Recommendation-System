"use server";

import {
    registerUserApi,
    loginUserApi,
    whoamiApi,
    updateUserApi,
    RegisterPayload,
    LoginPayload,
} from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";

export async function handleRegisterUser(payload: RegisterPayload) {
    try {
        const response = await registerUserApi(payload);
        return { success: true, message: response.message as string, data: response.data };
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong. Please try again.";
        return { success: false, message };
    }
}

export async function handleLoginUser(payload: LoginPayload) {
    try {
        const response = await loginUserApi(payload);
        const { user, token } = response.data;

        await setTokenCookie(token);
        await storeUserData(user);

        return { success: true, message: response.message as string, data: user };
    } catch (error: any) {
        const message = error?.response?.data?.message || "Invalid email or password";
        return { success: false, message };
    }
}

export async function handleGetCurrentUser() {
    try {
        const response = await whoamiApi();
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, data: null };
    }
}

export async function handleUpdateUser(formData: FormData) {
    try {
        const response = await updateUserApi(formData);
        // keep the cookie in sync so dashboard/navbar reflect the change immediately
        await storeUserData(response.data);
        return { success: true, message: response.message as string, data: response.data };
    } catch (error: any) {
        const message = error?.response?.data?.message || "Something went wrong. Please try again.";
        return { success: false, message };
    }
}