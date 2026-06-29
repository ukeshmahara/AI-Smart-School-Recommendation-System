import { Response } from "express";

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta;
}

export class ApiResponseHelper {
    static success<T>(
        res: Response,
        data: T,
        message: string = "Success",
        status: number = 200,
        meta?: PaginationMeta
    ): Response {
        return res.status(status).json({ status, success: true, message, data, meta });
    }
    static error(
        res: Response,
        message: string = "Error",
        status: number = 500,
        data?: null
    ): Response {
        return res.status(status).json({ status, success: false, message, data });
    }
}
