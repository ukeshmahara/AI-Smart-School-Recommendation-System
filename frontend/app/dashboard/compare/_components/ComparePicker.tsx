"use client";

import { useState } from "react";
import Link from "next/link";
import { School as SchoolIcon } from "lucide-react";
import { categoryLabel, streamLabel } from "../../schools/_components/constants";
import SchoolSlot from "./SchoolSlot";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

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

const ROWS = [
    { label: "Location", render: (s: SchoolSummary) => s.location },
    { label: "Category", render: (s: SchoolSummary) => categoryLabel(s.category) },
    {
        label: "Streams Offered",
        render: (s: SchoolSummary) => s.streamsOffered?.map((st) => streamLabel(st)).join(", ") || "-",
    },
    { label: "Annual Fees", render: (s: SchoolSummary) => `Rs ${s.fees.toLocaleString()}` },
    {
        label: "Facilities",
        render: (s: SchoolSummary) => (s.facilities && s.facilities.length > 0 ? s.facilities.join(", ") : "-"),
    },
    { label: "Phone", render: (s: SchoolSummary) => s.contactPhone || "-" },
    { label: "Email", render: (s: SchoolSummary) => s.contactEmail || "-" },
];

export default function ComparePicker({ initialSchools }: { initialSchools: SchoolSummary[] }) {
    const initialSlots: (SchoolSummary | null)[] = [
        initialSchools[0] || null,
        initialSchools[1] || null,
        initialSchools[2] || null,
    ];
    const [slots, setSlots] = useState<(SchoolSummary | null)[]>(initialSlots);

    const filledSchools = slots.filter(Boolean) as SchoolSummary[];
    const excludeIds = filledSchools.map((s) => s._id);

    const setSlot = (index: number, school: SchoolSummary) => {
        setSlots((prev) => {
            const next = [...prev];
            next[index] = school;
            return next;
        });
    };

    const removeSlot = (index: number) => {
        setSlots((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    };

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {slots.map((school, index) => (
                    <SchoolSlot
                        key={index}
                        school={school}
                        excludeIds={excludeIds}
                        optional={index === 2}
                        onSelect={(s) => setSlot(index, s)}
                        onRemove={() => removeSlot(index)}
                    />
                ))}
            </div>

            {filledSchools.length < 2 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                    <SchoolIcon className="h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">Add at least 2 schools to compare</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr>
                                <th className="w-40 border-b border-gray-100 p-4"></th>
                                {filledSchools.map((school) => (
                                    <th key={school._id} className="min-w-[200px] border-b border-l border-gray-100 p-4">
                                        <div className="mb-2 h-24 w-full overflow-hidden rounded-lg bg-gray-100">
                                            {school.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={`${API_BASE_URL}${school.image}`}
                                                    alt={school.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                    <SchoolIcon className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-semibold text-gray-900">{school.name}</p>
                                        <Link
                                            href={`/dashboard/schools/${school._id}`}
                                            className="mt-1 inline-block text-xs font-medium text-blue-700 hover:underline"
                                        >
                                            View details
                                        </Link>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ROWS.map((row) => (
                                <tr key={row.label}>
                                    <td className="border-b border-gray-50 p-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        {row.label}
                                    </td>
                                    {filledSchools.map((school) => (
                                        <td key={school._id} className="border-b border-l border-gray-50 p-4 text-sm text-gray-700">
                                            {row.render(school)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}