"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import UserFormModal from "./UserFormModal";
import DeleteUserModal from "./DeleteUserModal";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";

export interface AdminUser {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "student";
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface Props {
    initialUsers: AdminUser[];
    meta: Meta;
    initialSearch: string;
    loadError: boolean;
}

export default function UserManagementPanel({ initialUsers, meta, initialSearch, loadError }: Props) {
    const router = useRouter();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openCreateForm = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const openEditForm = (user: AdminUser) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const onFormSuccess = () => {
        setIsFormOpen(false);
        setEditingUser(null);
        router.refresh();
    };

    const confirmDelete = async () => {
        if (!deletingUser) return;
        setIsDeleting(true);
        const result = await handleDeleteUser(deletingUser._id);
        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message || "User deleted successfully");
        setDeletingUser(null);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar initialSearch={initialSearch} />
                <button
                    onClick={openCreateForm}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            {loadError ? (
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
                    Couldn&apos;t load users. Please refresh the page or try again.
                </div>
            ) : (
                <UserTable users={initialUsers} onEdit={openEditForm} onDelete={setDeletingUser} />
            )}

            <Pagination meta={meta} />

            {isFormOpen && (
                <UserFormModal user={editingUser} onClose={() => setIsFormOpen(false)} onSuccess={onFormSuccess} />
            )}

            {deletingUser && (
                <DeleteUserModal
                    user={deletingUser}
                    isDeleting={isDeleting}
                    onCancel={() => setDeletingUser(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}