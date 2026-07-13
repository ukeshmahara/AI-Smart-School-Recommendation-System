import { handleGetNotifications } from "@/lib/actions/admin/notification-action";
import AnnouncementsPanel from "./_components/AnnouncementsPanel";

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function AdminAnnouncementsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 10;

    const result = await handleGetNotifications(page, limit);

    return (
        <main className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Announcements</h1>
            <AnnouncementsPanel initialNotifications={result.data} meta={result.meta} />
        </main>
    );
}