"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { registerSchema, RegisterFormData } from "./schema";
import GoogleIcon from "@/app/_components/GoogleIcon";

const fieldBase =
    "w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:bg-white";
const fieldClass = `${fieldBase} pr-4`;
const fieldClassToggle = `${fieldBase} pr-11`;
const labelClass = "mb-2 block text-sm font-semibold text-gray-900";
const errorClass = "mt-1 text-sm text-red-600";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

    const onSubmit = (data: RegisterFormData) => {
        startTransition(async () => {
            // TODO (later sprint, backend wiring): call handleRegisterUser(data)
            // from lib/actions/auth-action.ts instead of this demo delay.
            await new Promise((resolve) => setTimeout(resolve, 700));
            console.log("Register form data:", data);
            toast.success("Account created (demo - backend not connected yet)");
        });
    };

    return (
        <div>
            <h1 className="text-center text-4xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-2 text-center text-gray-500">Join SikhshaSathi</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="fullName" className={labelClass}>
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            {...register("fullName")}
                            className={fieldClass}
                        />
                    </div>
                    {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className={labelClass}>
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className={fieldClass}
                        />
                    </div>
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="phone" className={labelClass}>
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...register("phone")}
                            className={fieldClass}
                        />
                    </div>
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className={labelClass}>
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...register("password")}
                            className={fieldClassToggle}
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
                    {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className={labelClass}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...register("confirmPassword")}
                            className={fieldClassToggle}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
                >
                    {isPending ? "Creating account..." : "Register"}
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
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-blue-700 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
