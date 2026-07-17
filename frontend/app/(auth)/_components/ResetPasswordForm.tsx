"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema, ResetPasswordFormData } from "./schema";
import { handleResetPassword } from "@/lib/actions/auth-action";

export default function ResetPasswordForm({ token }: { token: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

    const onSubmit = (data: ResetPasswordFormData) => {
        startTransition(async () => {
            const result = await handleResetPassword(token, data.newPassword);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.push("/login");
        });
    };

    return (
        <div>
            <h1 className="text-center text-4xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-center text-gray-500">Choose a new password for your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-gray-900">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            {...register("newPassword")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
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
                            type={showPassword ? "text" : "password"}
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
                    {isPending ? "Resetting..." : "Reset password"}
                </button>
            </form>
        </div>
    );
}