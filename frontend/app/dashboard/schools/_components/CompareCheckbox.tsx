"use client";

import { toast } from "react-toastify";
import { useCompare, MAX_COMPARE } from "@/lib/contexts/CompareContext";

export default function CompareCheckbox({ schoolId }: { schoolId: string }) {
    const { isSelected, toggleCompare, isMaxReached } = useCompare();
    const selected = isSelected(schoolId);

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selected && isMaxReached) {
            toast.info(`You can compare up to ${MAX_COMPARE} schools at a time`);
            return;
        }
        toggleCompare(schoolId);
    };

    return (
        <label
            onClick={onClick}
            className={`flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                selected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
        >
            <input type="checkbox" checked={selected} readOnly className="h-3.5 w-3.5" />
            {selected ? "Selected to compare" : "Add to compare"}
        </label>
    );
}