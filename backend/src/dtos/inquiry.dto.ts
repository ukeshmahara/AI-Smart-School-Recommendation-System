import { z } from "zod";
import { InquirySchema } from "../types/inquiry.type";

export const CreateInquiryDTO = InquirySchema.pick({
    schoolId: true,
    message: true,
});
export type CreateInquiryDTO = z.infer<typeof CreateInquiryDTO>;

export const UpdateInquiryStatusDTO = InquirySchema.pick({
    status: true,
});
export type UpdateInquiryStatusDTO = z.infer<typeof UpdateInquiryStatusDTO>;

export const ReplyToInquiryDTO = z.object({
    adminReply: z.string().min(2, "Reply is required").max(500, "Keep your reply under 500 characters"),
});
export type ReplyToInquiryDTO = z.infer<typeof ReplyToInquiryDTO>;