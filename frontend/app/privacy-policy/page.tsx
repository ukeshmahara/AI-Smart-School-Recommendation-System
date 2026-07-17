import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-10">
            <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="mb-6 text-sm text-gray-400">Last updated: July 2026</p>

            <div className="space-y-5 text-sm leading-relaxed text-gray-600">
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">What we collect</h2>
                    <p>
                        When you create an account, we collect your full name, email address, phone number, and
                        an optional profile photo. Any reviews, inquiries, or favorites you add are linked to
                        your account.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">How AI recommendations work</h2>
                    <p>
                        When you use the AI recommendation feature, the preferences you enter (stream, budget,
                        location, and any notes) along with a shortlist of matching schools from our database
                        are sent to Google&apos;s Gemini API to generate personalized reasoning. We only send
                        real school data already available on this platform, never your personal contact
                        details.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">How we use your data</h2>
                    <p>
                        Your information is used to operate your account, personalize recommendations, and let
                        schools respond to inquiries you send them. We do not sell your personal data to third
                        parties.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">Your content</h2>
                    <p>
                        Reviews you post are visible publicly to other students on the platform. You can edit or
                        delete your own reviews at any time from a school&apos;s page.
                    </p>
                </section>
                <section>
                    <h2 className="mb-1 text-base font-semibold text-gray-900">Contact</h2>
                    <p>
                        For questions about this policy, please reach out through the Help &amp; Support page.
                    </p>
                </section>
            </div>
        </main>
    );
}