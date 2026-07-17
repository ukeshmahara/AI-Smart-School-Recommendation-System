import { handleGetSchoolById } from "@/lib/actions/school-action";
import ComparePicker from "./_components/ComparePicker";

interface PageProps {
    searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const ids = (params.ids || "").split(",").filter(Boolean);

    const results = ids.length > 0 ? await Promise.all(ids.map((id) => handleGetSchoolById(id))) : [];
    const initialSchools = results.filter((r) => r.success && r.data).map((r) => r.data as any);

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">Compare Schools</h1>
            <p className="mb-6 text-sm text-gray-500">Add up to 3 schools to compare side by side.</p>
            <ComparePicker initialSchools={initialSchools} />
        </main>
    );
}