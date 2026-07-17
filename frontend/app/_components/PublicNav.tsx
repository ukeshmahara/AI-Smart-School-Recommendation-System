"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact Us" },
];

export default function PublicNav() {
    const pathname = usePathname();

    return (
        <header className="border-b border-gray-100">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/">
                    <Logo />
                </Link>
                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${
                                    isActive ? "text-blue-700" : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex gap-3">
                    <Link
                        href="/login"
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </header>
    );
}