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

export function categoryLabel(value: string) {
    return CATEGORY_OPTIONS.find((c) => c.value === value)?.label || value;
}

export function streamLabel(value: string) {
    return STREAM_OPTIONS.find((s) => s.value === value)?.label || value;
}