import { handleGetReviews } from "@/lib/actions/admin/review-action";
import ReviewTable from "./_components/ReviewTable";
import Pagination from "./_components/Pagination";
import RatingFilter from "./_components/RatingFilter";

interface PageProps {
    searchParams: Promise<{ page?: string; rating?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 10;
    const rating = params.rating ? Number(params.rating) : undefined;

    const result = await handleGetReviews(page, limit, rating);

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h1>
            <div className="space-y-4">
                <RatingFilter initialRating={params.rating || ""} />
                <ReviewTable reviews={result.data} />
                <Pagination meta={result.meta} />
            </div>
        </main>
    );
}