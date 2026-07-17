import Link from "next/link";
import ResetPasswordForm from "../_components/ResetPasswordForm";

interface PageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const token = params.token;

    if (!token) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Invalid link</h1>
                <p className="mt-2 text-gray-500">This reset link is missing a token.</p>
                <Link href="/forgot-password" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    return <ResetPasswordForm token={token} />;
}