import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FAQS = [
    {
        q: "How do I save a school to my favorites?",
        a: "Click the heart icon on any school card or on its detail page. You can view all your saved schools under Favorites in the sidebar.",
    },
    {
        q: "How does AI recommendation work?",
        a: "Go to AI Recommendations, fill in your preferred stream, budget, and location, and our AI will suggest real schools from our database that best match your preferences, along with an explanation for each.",
    },
    {
        q: "How do I compare schools?",
        a: "While browsing, check the \"Add to compare\" box on up to 3 schools, then click \"Compare Now\" from the floating bar that appears.",
    },
    {
        q: "How do I contact a school directly?",
        a: "Open a school's detail page and click \"Contact school\" to send an inquiry. You can track responses under Inquiries in the sidebar.",
    },
    {
        q: "I forgot my password. What do I do?",
        a: "On the login page, click \"Forgot Password?\" and follow the link sent to your registered email.",
    },
];

export default function HelpSupportPage() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-10">
            <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Help &amp; Support</h1>

            <div className="space-y-4">
                {FAQS.map((faq) => (
                    <div key={faq.q} className="rounded-xl border border-gray-100 bg-white p-4">
                        <p className="text-sm font-semibold text-gray-900">{faq.q}</p>
                        <p className="mt-1.5 text-sm text-gray-600">{faq.a}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                Still need help? Send an inquiry through any school&apos;s page, or reach out to your account
                administrator.
            </div>
        </main>
    );
}