"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const MAX_COMPARE = 3;

interface CompareContextProps {
    selectedIds: string[];
    toggleCompare: (id: string) => void;
    clearCompare: () => void;
    isSelected: (id: string) => boolean;
    isMaxReached: boolean;
}

const CompareContext = createContext<CompareContextProps | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleCompare = (id: string) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((i) => i !== id);
            if (prev.length >= MAX_COMPARE) return prev;
            return [...prev, id];
        });
    };

    const clearCompare = () => setSelectedIds([]);
    const isSelected = (id: string) => selectedIds.includes(id);
    const isMaxReached = selectedIds.length >= MAX_COMPARE;

    return (
        <CompareContext.Provider value={{ selectedIds, toggleCompare, clearCompare, isSelected, isMaxReached }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const ctx = useContext(CompareContext);
    if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
    return ctx;
}