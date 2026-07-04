"use server";

import { createSchoolApi, updateSchoolApi, deleteSchoolApi } from "../../api/admin/school";

export async function handleCreateSchool(formData: FormData) {
    try {
        const response = await createSchoolApi(formData);
        return { success: true, message: response.message, data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to create school" };
    }
}

export async function handleUpdateSchool(id: string, formData: FormData) {
    try {
        const response = await updateSchoolApi(id, formData);
        return { success: true, message: response.message, data: response.data };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to update school" };
    }
}

export async function handleDeleteSchool(id: string) {
    try {
        const response = await deleteSchoolApi(id);
        return { success: true, message: response.message };
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message || "Failed to delete school" };
    }
}