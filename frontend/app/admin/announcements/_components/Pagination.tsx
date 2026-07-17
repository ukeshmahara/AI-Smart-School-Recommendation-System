"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function Pagination({ meta }: { meta: Meta }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`${pathname}?${params.toString()}`);
    };

    if (meta.totalPages <= 1) return null;

    const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
            <p className="text-xs text-gray-500">
                Showing page {meta.page} of {meta.totalPages} ({meta.total} total notifications)
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => goToPage(meta.page - 1)}
                    disabled={meta.page <= 1}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`h-8 w-8 rounded-md text-sm font-medium ${
                            p === meta.page ? "bg-blue-700 text-white" : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}