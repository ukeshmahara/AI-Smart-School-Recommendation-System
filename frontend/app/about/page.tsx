import { Target, Users, Heart } from "lucide-react";
import PublicNav from "../_components/PublicNav";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNav />
            <main className="mx-auto max-w-3xl px-6 py-16">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    About us
                </span>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">Why SikhshaSathi?</h1>
                <p className="mt-4 text-gray-600 leading-relaxed">
                    Choosing a high school in Nepal usually means visiting campuses one by one, asking around, or
                    relying on word of mouth. There has never been an easy way to compare fees, streams, and
                    facilities side by side, all in one place.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                    SikhshaSathi was built to change that. We bring together verified school listings, real
                    student reviews, and AI-powered recommendations so families can make an informed decision
                    with confidence, without needing to visit every school in person.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 p-5 text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                            <Target className="h-5 w-5 text-blue-700" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-gray-900">Our mission</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Make school research transparent and accessible for every family.
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-5 text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-purple-50">
                            <Users className="h-5 w-5 text-purple-700" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-gray-900">Who it&apos;s for</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Students and parents comparing high schools across Nepal.
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-5 text-center">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
                            <Heart className="h-5 w-5 text-green-700" />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-gray-900">Built with care</p>
                        <p className="mt-1 text-xs text-gray-500">
                            Designed to be honest, simple, and genuinely useful.
                        </p>
                    </div>
                </div>
            </main>
            <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
                SikhshaSathi &mdash; Find the best school for a bright future
            </footer>
        </div>
    );
}