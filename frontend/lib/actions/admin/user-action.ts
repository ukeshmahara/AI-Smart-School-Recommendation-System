"use server";

import {
    getUsersApi,
    getUserByIdApi,
    createUserApi,
    updateUserApi,
    deleteUserApi,
    AdminUserPayload,
    AdminUserUpdatePayload,
} from "../../api/admin/user";

export async function handleGetUsers(page: number, limit: number, search: string) {
    try {
        const response = await getUsersApi(page, limit, search);
        return { success: true, data: response.data, meta: response.meta };
    } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to load users";
        return { success: false, data: [], meta: { page: 1, limit, total: 0, totalPages: 1 }, message };
    }
}

export async function handleGetUserById(id: string) {
    try {
        const response = await getUserByIdApi(id);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, data: null, message: error?.response?.data?.message || "User not found" };
    }
}

export async function handleCreateUser(payload: AdminUserPayload) {
    try {
        const response = await createUserApi(payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to create user" };
    }
}

export async function handleUpdateUserByAdmin(id: string, payload: AdminUserUpdatePayload) {
    try {
        const response = await updateUserApi(id, payload);
        return { success: true, message: response.message, data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to update user" };
    }
}

export async function handleDeleteUser(id: string) {
    try {
        const response = await deleteUserApi(id);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to delete user" };
    }
}