import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">SikhshaSathi</h1>
            <p className="text-gray-500">Find the best school for a bright future</p>
            <div className="flex gap-4">
                <Link href="/login" className="rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                    Login
                </Link>
                <Link href="/register" className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    Register
                </Link>
            </div>
        </main>
    );
}