"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORY_OPTIONS } from "./schema";

export default function CategoryFilter({ initialCategory }: { initialCategory: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("category", value);
        } else {
            params.delete("category");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            defaultValue={initialCategory}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-600"
        >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}