import { z } from "zod";

export const RecommendationPreferencesSchema = z.object({
    stream: z.enum(["science", "management", "humanities"]),
    minFee: z.coerce.number().min(0).default(0),
    maxFee: z.coerce.number().min(0).default(1500000),
    location: z.string().optional(),
    notes: z.string().max(300).optional(),
});
export type RecommendationPreferences = z.infer<typeof RecommendationPreferencesSchema>;

export const RecommendationResultSchema = z.object({
    recommendations: z.array(
        z.object({
            schoolId: z.string(),
            matchScore: z.number().min(0).max(100),
            reasoning: z.string(),
        })
    ),
});
export type RecommendationResult = z.infer<typeof RecommendationResultSchema>;