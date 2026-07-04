"use client";

import { AdminSchool } from "./SchoolManagementPanel";

interface Props {
    school: AdminSchool;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteSchoolModal({ school, isDeleting, onCancel, onConfirm }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center">
                <h2 className="text-lg font-bold text-gray-900">Delete school?</h2>
                <p className="mt-2 text-sm text-gray-500">
                    This will permanently delete <span className="font-semibold">{school.name}</span> ({school.location}).
                    This action cannot be undone.
                </p>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}