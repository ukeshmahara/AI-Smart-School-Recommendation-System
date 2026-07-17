"use client";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProfileForm from "../profile/_components/ProfileForm";
import ChangePasswordForm from "../password/_components/ChangePasswordForm";

export default function SettingsPage() {
    const [tab, setTab] = useState<"profile" | "password">("profile");
    const { user } = useAuth();

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

            <div className="mb-6 flex gap-6 border-b border-gray-200">
                <button
                    onClick={() => setTab("profile")}
                    className={`border-b-2 pb-2 text-sm font-semibold transition-colors ${
                        tab === "profile"
                            ? "border-blue-700 text-blue-700"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setTab("password")}
                    className={`border-b-2 pb-2 text-sm font-semibold transition-colors ${
                        tab === "password"
                            ? "border-blue-700 text-blue-700"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                    Password
                </button>
            </div>

            {tab === "profile" ? (user ? <ProfileForm user={user} /> : null) : <ChangePasswordForm />}
        </main>
    );
}