import { z } from "zod";

export const CATEGORY_OPTIONS = [
    { value: "international", label: "International" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "budget_friendly", label: "Budget-Friendly" },
] as const;

export const STREAM_OPTIONS = [
    { value: "science", label: "Science" },
    { value: "management", label: "Management" },
    { value: "humanities", label: "Humanities" },
] as const;

export const schoolSchema = z.object({
    name: z.string().min(2, "Enter the school name"),
    location: z.string().min(2, "Enter a location"),
    category: z.enum(["international", "public", "private", "budget_friendly"]),
    streamsOffered: z.array(z.enum(["science", "management", "humanities"])).min(1, "Select at least one stream"),
    fees: z.number().min(0, "Enter a valid fee amount"),
});
export type SchoolFormData = z.infer<typeof schoolSchema>;