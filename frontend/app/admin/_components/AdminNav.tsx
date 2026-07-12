"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { href: "/admin/users", label: "Users" },
    { href: "/admin/schools", label: "Schools" },
    { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}