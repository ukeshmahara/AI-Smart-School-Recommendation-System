import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getSchoolsApi = async (
    page: number,
    limit: number,
    search: string,
    category: string,
    stream: string,
    minFee?: number,
    maxFee?: number,
    sort?: string
) => {
    const response = await axiosInstance.get(API.SCHOOLS, {
        params: {
            page,
            limit,
            search: search || undefined,
            category: category || undefined,
            stream: stream || undefined,
            minFee,
            maxFee,
            sort: sort || undefined,
        },
    });
    return response.data;
};

export const getSchoolByIdApi = async (id: string) => {
    const response = await axiosInstance.get(`${API.SCHOOLS}/${id}`);
    return response.data;
};

export const getCategoryCountsApi = async () => {
    const response = await axiosInstance.get(API.SCHOOL_CATEGORY_COUNTS);
    return response.data;
};