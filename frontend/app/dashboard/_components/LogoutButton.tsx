"use client";

import { useAuth } from "@/lib/contexts/AuthContext";

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
        <button
            onClick={() => logout()}
            className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
            Logout
        </button>
    );
}