import { z } from "zod";

export const SchoolSchema = z.object({
    name: z.string().min(2, "School name is required"),
    location: z.string().min(2, "Location is required"),
    category: z.enum(["international", "public", "private", "budget_friendly"]),
    streamsOffered: z.array(z.enum(["science", "management", "humanities"])).min(1, "Select at least one stream"),
    fees: z.coerce.number().min(0, "Fees must be a positive number"),
    image: z.string().optional(),
});

export type SchoolType = z.infer<typeof SchoolSchema>;