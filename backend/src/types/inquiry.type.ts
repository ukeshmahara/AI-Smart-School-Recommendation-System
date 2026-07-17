import { z } from "zod";

export const InquirySchema = z.object({
    schoolId: z.string().min(1, "School id is required"),
    message: z.string().min(2, "Message is required").max(500, "Keep your message under 500 characters"),
    status: z.enum(["pending", "responded", "closed"]).default("pending"),
});

export type InquiryType = z.infer<typeof InquirySchema>;