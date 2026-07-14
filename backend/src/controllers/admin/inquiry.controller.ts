import { Request, Response } from "express";
import { z } from "zod";
import { AdminInquiryService } from "../../services/admin/inquiry.service";
import { UpdateInquiryStatusDTO, ReplyToInquiryDTO } from "../../dtos/inquiry.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";

const adminInquiryService = new AdminInquiryService();

export class AdminInquiryController {
    async getInquiries(req: Request, res: Response) {
        try {
            const page = Math.max(Number(req.query.page) || 1, 1);
            const limit = Math.max(Number(req.query.limit) || 10, 1);
            const { inquiries, meta } = await adminInquiryService.getInquiries(page, limit);
            return ApiResponseHelper.success(res, inquiries, "Inquiries fetched successfully", 200, meta);
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const parsed = UpdateInquiryStatusDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const inquiry = await adminInquiryService.updateStatus(req.params.id, parsed.data.status);
            return ApiResponseHelper.success(res, inquiry, "Inquiry status updated successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async replyToInquiry(req: Request, res: Response) {
        try {
            const parsed = ReplyToInquiryDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const inquiry = await adminInquiryService.replyToInquiry(req.params.id, parsed.data.adminReply);
            return ApiResponseHelper.success(res, inquiry, "Reply sent successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async deleteInquiry(req: Request, res: Response) {
        try {
            await adminInquiryService.deleteInquiry(req.params.id);
            return ApiResponseHelper.success(res, null, "Inquiry deleted successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}