import { z } from "zod";

export const SchoolSchema = z.object({
    name: z.string().min(2, "School name is required"),
    location: z.string().min(2, "Location is required"),
    category: z.enum(["international", "public", "private"]),
    streamsOffered: z.array(z.enum(["science", "management", "humanities"])).min(1, "Select at least one stream"),
    fees: z.coerce.number().min(0, "Fees must be a positive number"),
    description: z.string().max(1000, "Keep the description under 1000 characters").optional(),
    facilities: z.array(z.string()).optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
    contactWebsite: z.union([z.url("Enter a valid URL"), z.literal("")]).optional(),
    image: z.string().optional(),
});

export type SchoolType = z.infer<typeof SchoolSchema>;