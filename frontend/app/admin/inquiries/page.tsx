import { handleGetInquiries } from "@/lib/actions/admin/inquiry-action";
import InquiryTable from "./_components/InquiryTable";
import Pagination from "./_components/Pagination";

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function AdminInquiriesPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 10;

    const result = await handleGetInquiries(page, limit);

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Inquiries</h1>
            <div className="space-y-4">
                <InquiryTable inquiries={result.data} />
                <Pagination meta={result.meta} />
            </div>
        </main>
    );
}