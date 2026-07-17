"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function TopBarSearch() {
    const [value, setValue] = useState("");
    const router = useRouter();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (value.trim()) params.set("search", value.trim());
        router.push(`/dashboard/schools?${params.toString()}`);
    };

    return (
        <form onSubmit={onSubmit} className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search schools by name or location"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-600 focus:bg-white"
            />
        </form>
    );
}