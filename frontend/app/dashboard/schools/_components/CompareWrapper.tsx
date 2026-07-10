"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Scale, X } from "lucide-react";
import { CompareProvider, useCompare, MAX_COMPARE } from "@/lib/contexts/CompareContext";

function CompareBar() {
    const { selectedIds, clearCompare } = useCompare();
    const router = useRouter();

    if (selectedIds.length < 2) return null;

    const goToCompare = () => {
        router.push(`/dashboard/compare?ids=${selectedIds.join(",")}`);
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-6 py-3 shadow-lg">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{selectedIds.length}</span> of {MAX_COMPARE} schools selected
                </p>
                <div className="flex items-center gap-3">
                    <button
                        onClick={clearCompare}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4" /> Clear
                    </button>
                    <button
                        onClick={goToCompare}
                        className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        <Scale className="h-4 w-4" /> Compare Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CompareWrapper({ children }: { children: ReactNode }) {
    return (
        <CompareProvider>
            <div className="pb-20">{children}</div>
            <CompareBar />
        </CompareProvider>
    );
}