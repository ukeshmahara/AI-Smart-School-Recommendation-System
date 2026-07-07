import { z } from "zod";

export const CATEGORY_OPTIONS = [
    { value: "international", label: "International" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
] as const;

export const CATEGORY_FILTER_OPTIONS = [
    ...CATEGORY_OPTIONS,
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
    category: z.enum(["international", "public", "private"]),
    streamsOffered: z.array(z.enum(["science", "management", "humanities"])).min(1, "Select at least one stream"),
    fees: z.number().min(0, "Enter a valid fee amount"),
    description: z.string().max(1000, "Keep the description under 1000 characters").optional(),
    facilitiesText: z.string().optional(),
    phone: z.string().optional(),
    email: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
    website: z.union([z.url("Enter a valid URL"), z.literal("")]).optional(),
});
export type SchoolFormData = z.infer<typeof schoolSchema>;