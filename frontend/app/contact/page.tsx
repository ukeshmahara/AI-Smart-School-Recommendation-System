import { Mail, Phone, MapPin } from "lucide-react";
import PublicNav from "../_components/PublicNav";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNav />
            <main className="mx-auto max-w-2xl px-6 py-16 text-center">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Contact us
                </span>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">Have a question?</h1>
                <p className="mt-4 text-gray-600">
                    Reach out to us directly, or use the Help &amp; Support page after logging in for common
                    questions.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 p-5">
                        <Mail className="mx-auto h-5 w-5 text-blue-700" />
                        <p className="mt-2 text-sm font-semibold text-gray-900">Email</p>
                        <p className="mt-1 text-xs text-gray-500">support@sikhshasathi.com</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-5">
                        <Phone className="mx-auto h-5 w-5 text-green-700" />
                        <p className="mt-2 text-sm font-semibold text-gray-900">Phone</p>
                        <p className="mt-1 text-xs text-gray-500">01-4XXXXXX</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-5">
                        <MapPin className="mx-auto h-5 w-5 text-purple-700" />
                        <p className="mt-2 text-sm font-semibold text-gray-900">Location</p>
                        <p className="mt-1 text-xs text-gray-500">Kathmandu, Nepal</p>
                    </div>
                </div>
            </main>
            <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
                SikhshaSathi &mdash; Find the best school for a bright future
            </footer>
        </div>
    );
}