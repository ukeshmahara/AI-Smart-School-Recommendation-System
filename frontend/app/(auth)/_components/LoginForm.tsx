"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginFormData } from "./schema";
import { handleLoginUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import GoogleIcon from "@/app/_components/GoogleIcon";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { checkAuth } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const onSubmit = (data: LoginFormData) => {
        startTransition(async () => {
            const result = await handleLoginUser(data);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message || "Login successful");
            await checkAuth();
            router.push("/dashboard");
        });
    };

    return (
        <div>
            <h1 className="text-center text-4xl font-bold text-gray-900">Welcome</h1>
            <p className="mt-2 text-center text-gray-500">Login to continue</p>

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

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-900">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password")}
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
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm font-medium text-blue-700 hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
                >
                    {isPending ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs text-gray-400">or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => toast.info("Google sign-in isn't implemented yet")}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
                <GoogleIcon />
                Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-blue-700 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}