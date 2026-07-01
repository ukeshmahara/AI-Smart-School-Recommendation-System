"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { createUserSchema, editUserSchema, CreateUserFormData, EditUserFormData } from "./schema";
import { handleCreateUser, handleUpdateUserByAdmin } from "@/lib/actions/admin/user-action";
import { AdminUser } from "./UserManagementPanel";

interface Props {
    user: AdminUser | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function UserFormModal({ user, onClose, onSuccess }: Props) {
    const isEdit = !!user;
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserFormData | EditUserFormData>({
        resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
        defaultValues: isEdit
            ? { fullName: user!.fullName, email: user!.email, phone: user!.phone, role: user!.role, password: "" }
            : { role: "student" },
    });

    const onSubmit = (data: CreateUserFormData | EditUserFormData) => {
        startTransition(async () => {
            const result = isEdit
                ? await handleUpdateUserByAdmin(user!._id, { ...data, password: data.password || undefined })
                : await handleCreateUser(data as CreateUserFormData);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message || (isEdit ? "User updated successfully" : "User created successfully"));
            onSuccess();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit User" : "Add User"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Full Name</label>
                        <input
                            type="text"
                            {...register("fullName")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Phone Number</label>
                        <input
                            type="tel"
                            {...register("phone")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">
                            {isEdit ? "Password (leave blank to keep current)" : "Password"}
                        </label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Role</label>
                        <select
                            {...register("role")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        >
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                        >
                            {isPending ? "Saving..." : isEdit ? "Save changes" : "Create user"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}