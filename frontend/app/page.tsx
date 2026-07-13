import Link from "next/link";
import { SlidersHorizontal, Scale, Heart, Globe, Landmark, Building2, Wallet } from "lucide-react";
import Logo from "./_components/Logo";

const CATEGORIES = [
    { key: "international", label: "International", icon: Globe, bg: "bg-blue-50", color: "text-blue-700" },
    { key: "public", label: "Public", icon: Landmark, bg: "bg-green-50", color: "text-green-700" },
    { key: "private", label: "Private", icon: Building2, bg: "bg-purple-50", color: "text-purple-700" },
    { key: "budget_friendly", label: "Budget-Friendly", icon: Wallet, bg: "bg-amber-50", color: "text-amber-700" },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Logo />
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

            <main className="mx-auto max-w-4xl px-6 py-16 text-center">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    For high school students
                </span>
                <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                    Find the right high school, with confidence
                </h1>
                <p className="mx-auto mt-4 max-w-md text-gray-500">
                    Search, compare, and shortlist schools by stream, fees, and location, all in one place.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <Link
                        href="/register"
                        className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        Get started
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Browse schools
                    </Link>
                </div>
            </main>

            <section className="mx-auto max-w-4xl px-6 pb-16">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    <div className="text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                            <SlidersHorizontal className="h-5 w-5 text-blue-700" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-gray-900">Set your preferences</p>
                        <p className="mt-1 text-xs text-gray-500">Stream, budget, and location</p>
                    </div>
                    <div className="text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-purple-50">
                            <Scale className="h-5 w-5 text-purple-700" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-gray-900">Compare schools</p>
                        <p className="mt-1 text-xs text-gray-500">Side by side, at a glance</p>
                    </div>
                    <div className="text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
                            <Heart className="h-5 w-5 text-green-700" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-gray-900">Save your favorites</p>
                        <p className="mt-1 text-xs text-gray-500">Shortlist and decide later</p>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-4xl px-6">
                    <p className="mb-6 text-center text-sm font-semibold text-gray-900">Browse by category</p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.key}
                                href="/register"
                                className="rounded-xl border border-gray-100 bg-white p-4 text-center transition-colors hover:border-blue-200"
                            >
                                <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-lg ${cat.bg}`}>
                                    <cat.icon className={`h-5 w-5 ${cat.color}`} />
                                </span>
                                <p className="mt-3 text-sm font-semibold text-gray-900">{cat.label}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-4xl px-6 py-16">
                <div className="rounded-2xl bg-blue-700 px-8 py-12 text-center">
                    <h2 className="text-xl font-bold text-white">Ready to find your school?</h2>
                    <p className="mt-2 text-sm text-blue-100">Create a free account and start browsing today.</p>
                    <Link
                        href="/register"
                        className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                        Create free account
                    </Link>
                </div>
            </section>

            <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
                SikhshaSathi &mdash; Find the best school for a bright future
            </footer>
        </div>
    );
}