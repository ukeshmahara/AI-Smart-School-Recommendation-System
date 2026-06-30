"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Lock } from "lucide-react";
import { passwordSchema, PasswordFormData } from "../../_components/schema";
import { handleUpdateUser } from "@/lib/actions/auth-action";

export default function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

    const onSubmit = (data: PasswordFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("currentPassword", data.currentPassword);
            formData.append("newPassword", data.newPassword);

            const result = await handleUpdateUser(formData);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Password updated successfully");
            reset();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Change password</h2>

            <div>
                <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-gray-900">
                    Current Password
                </label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        {...register("currentPassword")}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                    />
                </div>
                {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-gray-900">
                    New Password
                </label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        {...register("newPassword")}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                    />
                </div>
                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>

            <div>
                <label htmlFor="confirmNewPassword" className="mb-2 block text-sm font-semibold text-gray-900">
                    Confirm New Password
                </label>
                <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        id="confirmNewPassword"
                        type="password"
                        placeholder="Confirm new password"
                        {...register("confirmNewPassword")}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                    />
                </div>
                {errors.confirmNewPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
            >
                {isPending ? "Updating..." : "Update password"}
            </button>
        </form>
    );
}