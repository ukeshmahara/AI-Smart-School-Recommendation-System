import { Users, School, Wallet, Heart as HeartIcon } from "lucide-react";
import { handleGetDashboardStats } from "@/lib/actions/admin/analytics-action";
import StatCard from "./_components/StatCard";
import CategoryBarChart from "./_components/CategoryBarChart";
import SignupTrendChart from "./_components/SignupTrendChart";
import TopFavoritedList from "./_components/TopFavoritedList";

export default async function AdminAnalyticsPage() {
    const result = await handleGetDashboardStats();

    if (!result.success || !result.data) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-8">
                <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
                    Couldn&apos;t load analytics. Please refresh the page or try again.
                </div>
            </main>
        );
    }

    const stats = result.data;

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Total Users" value={stats.totalUsers} icon={Users} bg="bg-blue-50" color="text-blue-700" />
                <StatCard label="Total Schools" value={stats.totalSchools} icon={School} bg="bg-purple-50" color="text-purple-700" />
                <StatCard
                    label="Average Fees"
                    value={`Rs ${stats.feeStats.average.toLocaleString()}`}
                    icon={Wallet}
                    bg="bg-amber-50"
                    color="text-amber-700"
                />
                <StatCard
                    label="Admins / Students"
                    value={`${stats.usersByRole.admin} / ${stats.usersByRole.student}`}
                    icon={HeartIcon}
                    bg="bg-green-50"
                    color="text-green-700"
                />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <CategoryBarChart data={stats.schoolsByCategory} />
                <SignupTrendChart data={stats.signupTrend} />
            </div>

            <div className="mt-4">
                <TopFavoritedList data={stats.topFavorited} />
            </div>
        </main>
    );
}