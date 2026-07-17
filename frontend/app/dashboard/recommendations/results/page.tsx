import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ResultsClient from "./_components/ResultsClient";

export default function RecommendationResultsPage() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <Link
                href="/dashboard/recommendations"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline"
            >
                <ArrowLeft className="h-4 w-4" />
                Adjust preferences
            </Link>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Recommended Schools</h1>
            <ResultsClient />
        </main>
    );
}