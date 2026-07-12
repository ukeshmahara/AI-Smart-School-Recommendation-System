"use server";

import { getFavoritesApi, addFavoriteApi, removeFavoriteApi } from "../api/favorite";

export async function handleGetFavorites() {
    try {
        const response = await getFavoritesApi();
        return { success: true, data: response.data as any[] };
    } catch (error: any) {
        return { success: false, data: [] as any[] };
    }
}

export async function handleAddFavorite(schoolId: string) {
    try {
        const response = await addFavoriteApi(schoolId);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to add favorite" };
    }
}

export async function handleRemoveFavorite(schoolId: string) {
    try {
        const response = await removeFavoriteApi(schoolId);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to remove favorite" };
    }
}