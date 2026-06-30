import ChangePasswordForm from "./_components/ChangePasswordForm";

export default function PasswordPage() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Password</h1>
            <ChangePasswordForm />
        </main>
    );
}