import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-indigo-50">
            <header className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Link>
                </div>
            </header>
            {children}
        </div>
    );
}