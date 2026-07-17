import Link from "next/link";
import { getUserData } from "@/lib/cookies";
import { handleGetCategoryCounts } from "@/lib/actions/school-action";
import { handleGetTopRatedSchools } from "@/lib/actions/review-action";
import { School, MapPin, Star, Globe, Landmark, Building2, Wallet, Sparkles, Brain } from "lucide-react";

const CATEGORY_META = [
    { key: "international", label: "International", icon: Globe, bg: "bg-blue-50", color: "text-blue-700" },
    { key: "public", label: "Public", icon: Landmark, bg: "bg-green-50", color: "text-green-700" },
    { key: "private", label: "Private", icon: Building2, bg: "bg-purple-50", color: "text-purple-700" },
    { key: "budget_friendly", label: "Budget-Friendly", icon: Wallet, bg: "bg-amber-50", color: "text-amber-700" },
] as const;

export default async function DashboardOverviewPage() {
    const user = await getUserData();
    const firstName = user?.fullName?.split(" ")[0] ?? "there";

    const [countsResult, topRatedResult] = await Promise.all([
        handleGetCategoryCounts(),
        handleGetTopRatedSchools(3),
    ]);

    const counts = countsResult.data;
    const topRated = topRatedResult.data;

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <div className="rounded-2xl bg-blue-700 p-8">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-200" />
                            <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">
                                AI school recommendation
                            </span>
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800">
                                Beta
                            </span>
                        </div>
                        <h1 className="mt-2 text-xl font-bold text-white">
                            Answer a few questions, {firstName}, and let AI find schools that fit.
                        </h1>
                    </div>
                    <Link
                        href="/dashboard/recommendations"
                        className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                    >
                        <Brain className="h-4 w-4" />
                        Get AI Recommendations
                    </Link>
                </div>
            </div>

            <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-gray-900">Browse by category</p>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {CATEGORY_META.map((cat) => (
                        <Link
                            key={cat.key}
                            href={`/dashboard/schools?category=${cat.key}`}
                            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/30"
                        >
                            <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${cat.bg}`}>
                                <cat.icon className={`h-5 w-5 ${cat.color}`} />
                            </span>
                            <p className="mt-3 text-xl font-bold text-gray-900">{counts?.[cat.key] ?? 0}</p>
                            <p className="text-xs text-gray-500">{cat.label} schools</p>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Top Rated Schools</h2>
                <div className="space-y-3">
                    {topRated.length === 0 ? (
                        <p className="py-6 text-center text-sm text-gray-400">
                            No schools have been reviewed yet.
                        </p>
                    ) : (
                        topRated.map((item: any) => (
                            <Link
                                key={item.school._id}
                                href={`/dashboard/schools/${item.school._id}`}
                                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 transition-colors hover:bg-blue-50/50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                        <School className="h-5 w-5 text-blue-700" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.school.name}</p>
                                        <p className="flex items-center gap-1 text-xs text-gray-500">
                                            <MapPin className="h-3 w-3" /> {item.school.location}
                                        </p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    {item.average} <span className="font-normal text-amber-500">({item.count})</span>
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}