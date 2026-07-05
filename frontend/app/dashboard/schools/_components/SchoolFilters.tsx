"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORY_OPTIONS, STREAM_OPTIONS } from "./constants";

interface Props {
    initialSearch: string;
    initialCategory: string;
    initialStream: string;
}

export default function SchoolFilters({ initialSearch, initialCategory, initialStream }: Props) {
    const [search, setSearch] = useState(initialSearch);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => updateParam("search", search), 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or location"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600"
                />
            </div>
            <select
                defaultValue={initialCategory}
                onChange={(e) => updateParam("category", e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-600"
            >
                <option value="">All categories</option>
                {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <select
                defaultValue={initialStream}
                onChange={(e) => updateParam("stream", e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-600"
            >
                <option value="">All streams</option>
                {STREAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}