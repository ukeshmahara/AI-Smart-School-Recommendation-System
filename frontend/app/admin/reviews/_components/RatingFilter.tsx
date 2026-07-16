"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function RatingFilter({ initialRating }: { initialRating: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const onChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("rating", value);
        } else {
            params.delete("rating");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            defaultValue={initialRating}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-600"
        >
            <option value="">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
        </select>
    );
}