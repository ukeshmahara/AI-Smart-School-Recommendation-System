import { handleGetSchools } from "@/lib/actions/school-action";
import SchoolFilters from "./_components/SchoolFilters";
import SchoolGrid from "./_components/SchoolGrid";
import Pagination from "./_components/Pagination";

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; category?: string; stream?: string }>;
}

export default async function BrowseSchoolsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 9;
    const search = params.search || "";
    const category = params.category || "";
    const stream = params.stream || "";

    const result = await handleGetSchools(page, limit, search, category, stream);

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Browse Schools</h1>

            <div className="space-y-4">
                <SchoolFilters initialSearch={search} initialCategory={category} initialStream={stream} />

                {!result.success ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
                        Couldn&apos;t load schools. Please refresh the page or try again.
                    </div>
                ) : (
                    <SchoolGrid schools={result.data} />
                )}

                <Pagination meta={result.meta} />
            </div>
        </main>
    );
}