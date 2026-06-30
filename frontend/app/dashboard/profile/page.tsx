import { handleGetCurrentUser } from "@/lib/actions/auth-action";
import ProfileForm from "./_components/ProfileForm";

export default async function ProfilePage() {
    const result = await handleGetCurrentUser();
    const user = result.data;

    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>
            {user ? (
                <ProfileForm user={user} />
            ) : (
                <p className="text-gray-500">Unable to load your profile. Please try logging in again.</p>
            )}
        </main>
    );
}