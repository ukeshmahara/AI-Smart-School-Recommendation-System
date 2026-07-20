"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    School as SchoolIcon,
    Megaphone,
    MessageSquare,
    Star,
    ArrowLeft,
} from "lucide-react";
import Logo from "../../_components/Logo";

const NAV_ITEMS = [
    { href: "/admin/analytics", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/schools", label: "Schools", icon: SchoolIcon },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-blue-100 bg-gradient-to-b from-blue-50 to-blue-100 px-3 py-5">
            <div className="mb-6 flex items-center gap-2 px-2">
                <Logo />
            </div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-blue-900/50">Admin Panel</p>

            <nav className="flex flex-1 flex-col gap-0.5">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-white text-blue-700 shadow-sm"
                                    : "text-blue-900/70 hover:bg-white/60 hover:text-blue-900"
                            }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-4 border-t border-blue-200 pt-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-blue-900/60 hover:bg-white/60 hover:text-blue-900"
                >
                    <ArrowLeft className="h-[18px] w-[18px]" />
                    Student view
                </Link>
            </div>
        </aside>
    );
}