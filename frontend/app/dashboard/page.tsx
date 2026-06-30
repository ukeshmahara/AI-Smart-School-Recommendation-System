import { getUserData } from "@/lib/cookies";
import { School, Star, Bookmark, ClipboardList, MapPin, ArrowRight } from "lucide-react";

// Static placeholder data - will be replaced once the School API/recommendation
// logic is built in a later sprint.
const stats = [
    { label: "Schools Found", value: "1,240", icon: School, bg: "bg-blue-50", color: "text-blue-700" },
    { label: "Recommendations", value: "38", icon: Star, bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Saved Schools", value: "12", icon: Bookmark, bg: "bg-green-50", color: "text-green-600" },
    { label: "Reviews Read", value: "95", icon: ClipboardList, bg: "bg-pink-50", color: "text-pink-600" },
];

const recommendedSchools = [
    { name: "Bal Mandir School", location: "Kathmandu", type: "Private", rating: 4.8 },
    { name: "Budhanilkantha School", location: "Budhanilkantha", type: "Boarding", rating: 4.9 },
    { name: "Rato Bangala School", location: "Patan", type: "Private", rating: 4.7 },
    { name: "St. Xavier's School", location: "Maitighar", type: "Private", rating: 4.6 },
];

export default async function DashboardOverviewPage() {
    const user = await getUserData();
    const firstName = user?.fullName?.split(" ")[0] ?? "there";

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-blue-700 p-8 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}! 👋</h1>
                    <p className="mt-1 text-blue-100">Find the perfect school for a bright future.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50">
                    Find Schools <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </span>
                        <div>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-900">Top Recommended Schools</h2>
                <div className="mt-4 space-y-3">
                    {recommendedSchools.map((school) => (
                        <div
                            key={school.name}
                            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                    <School className="h-5 w-5 text-blue-700" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{school.name}</p>
                                    <p className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="h-3 w-3" /> {school.location}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {school.type}
                                </span>
                                <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {school.rating}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}