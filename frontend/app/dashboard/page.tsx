import { getUserData } from "@/lib/cookies";
import LogoutButton from "./_components/LogoutButton";

export default async function DashboardPage() {
    const user = await getUserData();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-indigo-50 px-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName ?? "Student"}!</h1>
            <p className="text-gray-500">You&apos;re logged in as {user?.email}</p>
            <p className="text-sm text-gray-400">
                This is a placeholder dashboard - we&apos;ll build it out further in a later sprint.
            </p>
            <LogoutButton />
        </main>
    );
}