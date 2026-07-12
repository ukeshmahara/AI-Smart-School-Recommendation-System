"use server";

import { getSchoolsApi, getSchoolByIdApi, getCategoryCountsApi } from "../api/school";

export async function handleGetSchools(
    page: number,
    limit: number,
    search: string,
    category: string,
    stream: string,
    minFee?: number,
    maxFee?: number,
    sort?: string
) {
    try {
        const response = await getSchoolsApi(page, limit, search, category, stream, minFee, maxFee, sort);
        return { success: true, data: response.data, meta: response.meta };
    } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to load schools";
        return { success: false, data: [], meta: { page: 1, limit, total: 0, totalPages: 1 }, message };
    }
}

export async function handleGetSchoolById(id: string) {
    try {
        const response = await getSchoolByIdApi(id);
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, data: null, message: error?.response?.data?.message || "School not found" };
    }
}

export async function handleGetCategoryCounts() {
    try {
        const response = await getCategoryCountsApi();
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            data: { international: 0, public: 0, private: 0, budget_friendly: 0 },
        };
    }
}