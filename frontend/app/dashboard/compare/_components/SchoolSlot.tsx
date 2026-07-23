"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Plus, X, School as SchoolIcon, Search } from "lucide-react";
import { handleGetSchools } from "@/lib/actions/school-action";
import { getImageUrl } from "@/lib/image-url";

interface SchoolSummary {
    _id: string;
    name: string;
    location: string;
    fees: number;
    image?: string;
    category: string;
    streamsOffered: string[];
    facilities?: string[];
    contactPhone?: string;
    contactEmail?: string;
}

interface Props {
    school: SchoolSummary | null;
    excludeIds: string[];
    optional?: boolean;
    onSelect: (school: SchoolSummary) => void;
    onRemove: () => void;
}

export default function SchoolSlot({ school, excludeIds, optional, onSelect, onRemove }: Props) {
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SchoolSummary[]>([]);
    const [isPending, startTransition] = useTransition();
    const boxRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
                setIsSearching(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        if (!isSearching) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            startTransition(async () => {
                const result = await handleGetSchools(1, 8, query, "", "");
                setResults(result.data.filter((s: any) => !excludeIds.includes(s._id)));
            });
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, isSearching]);

    const openSearch = () => {
        setIsSearching(true);
        setQuery("");
    };

    const pick = (s: SchoolSummary) => {
        onSelect(s);
        setIsSearching(false);
    };

    if (school) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {school.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImageUrl(school.image)} alt={school.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                            <SchoolIcon className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-gray-900">{school.name}</p>
                    <p className="text-[11px] text-gray-400">Rs {school.fees.toLocaleString()}</p>
                </div>
                <button onClick={onRemove} aria-label="Remove school" className="shrink-0 text-gray-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={boxRef}>
            <button
                onClick={openSearch}
                className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 py-4 text-gray-400 hover:border-blue-300 hover:text-blue-600"
            >
                <Plus className="h-5 w-5" />
                <span className="text-xs">{optional ? "Add third school (optional)" : "Add school"}</span>
            </button>

            {isSearching && (
                <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="relative border-b border-gray-100 p-2">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search schools..."
                            className="w-full rounded-lg border-0 bg-gray-50 py-1.5 pl-8 pr-2 text-xs outline-none"
                        />
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {isPending ? (
                            <p className="p-3 text-center text-xs text-gray-400">Searching...</p>
                        ) : results.length === 0 ? (
                            <p className="p-3 text-center text-xs text-gray-400">No schools found</p>
                        ) : (
                            results.map((s) => (
                                <button
                                    key={s._id}
                                    onClick={() => pick(s)}
                                    className="flex w-full items-center justify-between border-b border-gray-50 px-3 py-2 text-left text-xs last:border-0 hover:bg-gray-50"
                                >
                                    <span className="truncate font-medium text-gray-900">{s.name}</span>
                                    <span className="shrink-0 text-gray-400">{s.location}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}