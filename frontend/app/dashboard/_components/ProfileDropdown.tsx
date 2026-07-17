"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    User,
    Settings,
    ShieldCheck,
    FileText,
    HelpCircle,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

interface Props {
    showPolicyLinks?: boolean;
}

export default function ProfileDropdown({ showPolicyLinks = true }: Props) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-gray-50"
            >
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue-50">
                    {user?.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`${API_BASE_URL}${user.profileImage}`}
                            alt={user.fullName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-blue-700">
                            <User className="h-4 w-4" />
                        </div>
                    )}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 p-3">
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-blue-50">
                            {user?.profileImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={`${API_BASE_URL}${user.profileImage}`}
                                    alt={user.fullName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-blue-700">
                                    <User className="h-4 w-4" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{user?.fullName}</p>
                            <p className="truncate text-xs text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="py-1">
                        <Link
                            href="/dashboard/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                    </div>

                    {showPolicyLinks && (
                        <>
                            <div className="border-t border-gray-100" />
                            <div className="py-1">
                                <Link
                                    href="/privacy-policy"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Privacy Policy
                                </Link>
                                <Link
                                    href="/terms-of-service"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <FileText className="h-4 w-4" />
                                    Terms of Service
                                </Link>
                                <Link
                                    href="/help-support"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                    Help &amp; Support
                                </Link>
                            </div>
                        </>
                    )}

                    <div className="border-t border-gray-100" />
                    <div className="py-1">
                        <button
                            onClick={() => logout()}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}