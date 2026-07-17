import { Request, Response } from "express";
import { z } from "zod";
import { InquiryService } from "../services/inquiry.service";
import { CreateInquiryDTO } from "../dtos/inquiry.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";

const inquiryService = new InquiryService();

export class InquiryController {
    async createInquiry(req: Request, res: Response) {
        try {
            const parsed = CreateInquiryDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const studentId = (req.user as any)._id;
            const inquiry = await inquiryService.createInquiry(studentId, parsed.data);
            return ApiResponseHelper.success(res, inquiry, "Inquiry sent successfully", 201);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async getMyInquiries(req: Request, res: Response) {
        try {
            const studentId = (req.user as any)._id;
            const inquiries = await inquiryService.getMyInquiries(studentId);
            return ApiResponseHelper.success(res, inquiries, "Inquiries fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}