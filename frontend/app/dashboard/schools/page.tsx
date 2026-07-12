import { handleGetSchools } from "@/lib/actions/school-action";
import { handleGetFavorites } from "@/lib/actions/favorite-action";
import SchoolFilters from "./_components/SchoolFilters";
import SchoolGrid from "./_components/SchoolGrid";
import Pagination from "./_components/Pagination";
import CompareWrapper from "./_components/CompareWrapper";
import { MIN_FEE, MAX_FEE } from "./_components/constants";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        category?: string;
        stream?: string;
        sort?: string;
        minFee?: string;
        maxFee?: string;
    }>;
}

export default async function BrowseSchoolsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 9;
    const search = params.search || "";
    const category = params.category || "";
    const stream = params.stream || "";
    const sort = params.sort || "";
    const minFee = params.minFee ? Number(params.minFee) : undefined;
    const maxFee = params.maxFee ? Number(params.maxFee) : undefined;

    const [result, favoritesResult] = await Promise.all([
        handleGetSchools(page, limit, search, category, stream, minFee, maxFee, sort),
        handleGetFavorites(),
    ]);

    const favoritedIds = new Set(favoritesResult.data.map((s: any) => s._id));

    return (
        <CompareWrapper>
            <main className="mx-auto max-w-6xl px-6 py-8">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Browse Schools</h1>

                <div className="space-y-4">
                    <SchoolFilters
                        initialSearch={search}
                        initialCategory={category}
                        initialStream={stream}
                        initialSort={sort}
                        initialMinFee={minFee ?? MIN_FEE}
                        initialMaxFee={maxFee ?? MAX_FEE}
                    />

                    {!result.success ? (
                        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
                            Couldn&apos;t load schools. Please refresh the page or try again.
                        </div>
                    ) : (
                        <SchoolGrid schools={result.data} favoritedIds={favoritedIds} />
                    )}

                    <Pagination meta={result.meta} />
                </div>
            </main>
        </CompareWrapper>
    );
}