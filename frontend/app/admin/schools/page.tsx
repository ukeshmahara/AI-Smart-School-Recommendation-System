import { handleGetSchools } from "@/lib/actions/school-action";
import SchoolManagementPanel from "./_components/SchoolManagementPanel";

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; category?: string; stream?: string }>;
}

export default async function AdminSchoolsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 10;
    const search = params.search || "";
    const category = params.category || "";
    const stream = params.stream || "";

    const result = await handleGetSchools(page, limit, search, category, stream);

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">School Management</h1>
            <SchoolManagementPanel
                initialSchools={result.data}
                meta={result.meta}
                initialSearch={search}
                initialCategory={category}
                initialStream={stream}
                loadError={!result.success}
            />
        </main>
    );
}