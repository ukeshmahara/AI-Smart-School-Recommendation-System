"use client";

import { Pencil, Trash2, School as SchoolIcon } from "lucide-react";
import { AdminSchool } from "./SchoolManagementPanel";
import { CATEGORY_FILTER_OPTIONS, STREAM_OPTIONS } from "./schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

function categoryLabel(value: string) {
    return CATEGORY_FILTER_OPTIONS.find((c) => c.value === value)?.label || value;
}
function streamLabel(value: string) {
    return STREAM_OPTIONS.find((s) => s.value === value)?.label || value;
}

interface Props {
    schools: AdminSchool[];
    onEdit: (school: AdminSchool) => void;
    onDelete: (school: AdminSchool) => void;
}

export default function SchoolTable({ schools, onEdit, onDelete }: Props) {
    if (schools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <SchoolIcon className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No schools found</p>
                <p className="text-xs text-gray-400">Try a different search or add a new school.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                        <th className="px-4 py-3 font-medium">School</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Streams</th>
                        <th className="px-4 py-3 font-medium">Annual fees</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {schools.map((school) => (
                        <tr key={school._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        {school.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`${API_BASE_URL}${school.image}`}
                                                alt={school.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                <SchoolIcon className="h-5 w-5" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900">{school.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{school.location}</td>
                            <td className="px-4 py-3">
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                    {categoryLabel(school.category)}
                                </span>
                                {school.fees <= 50000 && (
                                    <span className="ml-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                        Budget-Friendly
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {school.streamsOffered.map((s) => (
                                        <span
                                            key={s}
                                            className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700"
                                        >
                                            {streamLabel(s)}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">Rs {school.fees.toLocaleString()}</td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(school)}
                                        className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-700"
                                        aria-label={`Edit ${school.name}`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(school)}
                                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                        aria-label={`Delete ${school.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}