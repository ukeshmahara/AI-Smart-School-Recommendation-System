"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, School as SchoolIcon, ArrowLeft } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

interface RecommendationItem {
    schoolId: string;
    matchScore: number;
    reasoning: string;
    school: any;
}

export default function ResultsClient() {
    const [data, setData] = useState<{ recommendations: RecommendationItem[]; usedAi: boolean } | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("recommendationResult");
        if (stored) setData(JSON.parse(stored));
    }, []);

    if (!data) {
        return (
            <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
                <p className="text-sm text-gray-500">No recommendations to show.</p>
                <Link href="/dashboard/recommendations" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline">
                    Fill out preferences
                </Link>
            </div>
        );
    }

    if (data.recommendations.length === 0) {
        return (
            <div className="rounded-xl border border-gray-100 bg-white p-10 text-center">
                <SchoolIcon className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">No schools matched your preferences. Try a wider budget or stream.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {!data.usedAi && (
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    AI reasoning is temporarily unavailable, showing filtered matches instead.
                </div>
            )}
            {data.recommendations.map((item) => (
                <Link
                    key={item.schoolId}
                    href={`/dashboard/schools/${item.schoolId}`}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-blue-200"
                >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {item.school?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={`${API_BASE_URL}${item.school.image}`}
                                alt={item.school.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                <SchoolIcon className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-gray-900">{item.school?.name}</p>
                            <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                {Math.round(item.matchScore)}% match
                            </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3" /> {item.school?.location} &middot; Rs {item.school?.fees?.toLocaleString()}
                        </p>
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-600">
                            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                            {item.reasoning}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}