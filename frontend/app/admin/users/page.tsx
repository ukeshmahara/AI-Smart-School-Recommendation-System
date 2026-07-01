import { handleGetUsers } from "@/lib/actions/admin/user-action";
import UserManagementPanel from "./_components/UserManagementPanel";

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = 10;
    const search = params.search || "";

    const result = await handleGetUsers(page, limit, search);

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">User Management</h1>
            <UserManagementPanel
                initialUsers={result.data}
                meta={result.meta}
                initialSearch={search}
                loadError={!result.success}
            />
        </main>
    );
}