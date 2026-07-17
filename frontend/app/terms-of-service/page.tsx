import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-10">
            <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mb-6 text-sm text-gray-400">Last updated: July 2026</p>

            <div className="space-y-5 text-sm leading-relaxed text-gray-600">
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">Purpose of this platform</h2>
                    <p>
                        SikhshaSathi is an informational platform to help students research, compare, and
                        shortlist high schools. It is not an official admissions system, and submitting an
                        inquiry through this platform does not constitute an application to any school.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">Accurate information</h2>
                    <p>
                        Reviews and inquiries you submit should reflect genuine experiences and questions. Fake
                        reviews, spam, or abusive content may be removed by an administrator, and repeated
                        misuse may result in account restrictions.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">AI recommendations</h2>
                    <p>
                        AI-generated recommendations are intended as a helpful starting point, not a guarantee
                        of admission, fit, or accuracy. Always verify details directly with a school before
                        making decisions.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">Account responsibility</h2>
                    <p>
                        You are responsible for keeping your account credentials secure and for the accuracy of
                        information you provide.
                    </p>
                </section>
            </div>
        </main>
    );
}