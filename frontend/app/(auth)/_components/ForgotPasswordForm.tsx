"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordFormData } from "./schema";
import { handleForgotPassword } from "@/lib/actions/auth-action";

export default function ForgotPasswordForm() {
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
    } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

    const onSubmit = (data: ForgotPasswordFormData) => {
        startTransition(async () => {
            const result = await handleForgotPassword(data.email);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
        });
    };

    return (
        <div>
            <h1 className="text-center text-4xl font-bold text-gray-900">Forgot Password</h1>
            <p className="mt-2 text-center text-gray-500">Enter your email and we'll send you a reset link</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
                >
                    {isPending ? "Sending..." : "Send reset link"}
                </button>
            </form>

            {isSubmitSuccessful && (
                <p className="mt-4 text-center text-sm text-gray-500">
                    If that email is registered, check your inbox for a reset link.
                </p>
            )}

            <p className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-600">
                <ArrowLeft className="h-4 w-4" />
                <Link href="/login" className="font-semibold text-blue-700 hover:underline">
                    Back to login
                </Link>
            </p>
        </div>
    );
}