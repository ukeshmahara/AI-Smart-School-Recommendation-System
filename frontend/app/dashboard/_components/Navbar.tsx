"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import Logo from "@/app/_components/Logo";
import LogoutButton from "./LogoutButton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

const tabs = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/schools", label: "Schools" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/password", label: "Password" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <header className="border-b border-gray-100 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="scale-90">
                        <Logo />
                    </Link>
                    <nav className="hidden items-center gap-1 sm:flex">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                        {isAdmin && (
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100">
                            {user?.profileImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`${API_BASE_URL}${user.profileImage}`}
                                    alt={user.fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </div>

            <nav className="flex items-center gap-1 border-t border-gray-100 px-6 py-2 sm:hidden">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
                {isAdmin && (
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-purple-700"
                    >
                        <ShieldCheck className="h-4 w-4" />
                        Admin
                    </Link>
                )}
            </nav>
        </header>
    );
}