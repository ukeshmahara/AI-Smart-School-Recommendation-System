"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Search,
    Heart,
    Scale,
    Sparkles,
    MessageSquare,
    MessagesSquare,
    Settings as SettingsIcon,
    ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import Logo from "@/app/_components/Logo";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/schools", label: "Browse Schools", icon: Search },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/compare", label: "Compare", icon: Scale },
    { href: "/dashboard/recommendations", label: "AI Recommendations", icon: Sparkles },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/dashboard/chatbot", label: "Chatbot", icon: MessagesSquare },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    return (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-blue-100 bg-gradient-to-b from-blue-50 to-blue-100 px-3.5 py-5">
            <div className="mb-5 flex items-center gap-2 px-1.5">
                <Logo />
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-white text-blue-700 shadow-sm"
                                    : "text-blue-900/70 hover:bg-white/60 hover:text-blue-900"
                            }`}
                        >
                            <item.icon className="h-[18px] w-[18px]" />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="my-2 border-t border-blue-200" />

                <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        pathname.startsWith("/dashboard/settings")
                            ? "bg-white text-blue-700 shadow-sm"
                            : "text-blue-900/70 hover:bg-white/60 hover:text-blue-900"
                    }`}
                >
                    <SettingsIcon className="h-[18px] w-[18px]" />
                    Settings
                </Link>

                {isAdmin && (
                    <Link
                        href="/admin/analytics"
                        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-purple-700 hover:bg-white/60"
                    >
                        <ShieldCheck className="h-[18px] w-[18px]" />
                        Admin Panel
                    </Link>
                )}
            </nav>
        </aside>
    );
}