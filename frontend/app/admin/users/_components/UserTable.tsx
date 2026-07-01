"use client";

import { Pencil, Trash2, User } from "lucide-react";
import { AdminUser } from "./UserManagementPanel";

interface Props {
    users: AdminUser[];
    onEdit: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <User className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No users found</p>
                <p className="text-xs text-gray-400">Try a different search or add a new user.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{user.fullName}</td>
                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        user.role === "admin"
                                            ? "bg-purple-50 text-purple-700"
                                            : "bg-blue-50 text-blue-700"
                                    }`}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-700"
                                        aria-label={`Edit ${user.fullName}`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                        aria-label={`Delete ${user.fullName}`}
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