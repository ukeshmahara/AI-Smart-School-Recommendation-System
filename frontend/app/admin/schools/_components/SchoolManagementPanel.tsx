"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import StreamFilter from "./StreamFilter";
import SchoolTable from "./SchoolTable";
import Pagination from "./Pagination";
import SchoolFormModal from "./SchoolFormModal";
import DeleteSchoolModal from "./DeleteSchoolModal";
import { handleDeleteSchool } from "@/lib/actions/admin/school-action";

export interface AdminSchool {
    _id: string;
    name: string;
    location: string;
    category: "international" | "public" | "private" | "budget_friendly";
    streamsOffered: ("science" | "management" | "humanities")[];
    fees: number;
    image?: string;
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Props {
    initialSchools: AdminSchool[];
    meta: Meta;
    initialSearch: string;
    initialCategory: string;
    initialStream: string;
    loadError: boolean;
}

export default function SchoolManagementPanel({
    initialSchools,
    meta,
    initialSearch,
    initialCategory,
    initialStream,
    loadError,
}: Props) {
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSchool, setEditingSchool] = useState<AdminSchool | null>(null);
    const [deletingSchool, setDeletingSchool] = useState<AdminSchool | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateForm = () => {
        setEditingSchool(null);
        setIsFormOpen(true);
    };

    const openEditForm = (school: AdminSchool) => {
        setEditingSchool(school);
        setIsFormOpen(true);
    };

    const onFormSuccess = () => {
        setIsFormOpen(false);
        setEditingSchool(null);
        router.refresh();
    };

    const confirmDelete = async () => {
        if (!deletingSchool) return;
        setIsDeleting(true);
        const result = await handleDeleteSchool(deletingSchool._id);
        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message || "School deleted successfully");
        setDeletingSchool(null);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                    <SearchBar initialSearch={initialSearch} />
                    <CategoryFilter initialCategory={initialCategory} />
                    <StreamFilter initialStream={initialStream} />
                </div>
                <button
                    onClick={openCreateForm}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                    <Plus className="h-4 w-4" />
                    Add School
                </button>
            </div>

            {loadError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
                    Couldn&apos;t load schools. Please refresh the page or try again.
                </div>
            ) : (
                <SchoolTable schools={initialSchools} onEdit={openEditForm} onDelete={setDeletingSchool} />
            )}

            <Pagination meta={meta} />

            {isFormOpen && (
                <SchoolFormModal school={editingSchool} onClose={() => setIsFormOpen(false)} onSuccess={onFormSuccess} />
            )}

            {deletingSchool && (
                <DeleteSchoolModal
                    school={deletingSchool}
                    isDeleting={isDeleting}
                    onCancel={() => setDeletingSchool(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}