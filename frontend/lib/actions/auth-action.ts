"use server";

import { registerUserApi, loginUserApi, RegisterPayload, LoginPayload } from "../api/auth";
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