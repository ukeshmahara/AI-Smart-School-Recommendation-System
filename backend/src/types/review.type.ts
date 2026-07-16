import { z } from "zod";

export const ReviewSchema = z.object({
    schoolId: z.string().min(1, "School id is required"),
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().min(2, "Comment is required").max(500, "Keep your review under 500 characters"),
});

export type ReviewType = z.infer<typeof ReviewSchema>;