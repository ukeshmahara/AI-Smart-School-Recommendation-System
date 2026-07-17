import { SlidersHorizontal, Sparkles, Scale, MessageSquare } from "lucide-react";
import PublicNav from "../_components/PublicNav";

const STEPS = [
    {
        icon: SlidersHorizontal,
        title: "Set your preferences",
        description: "Tell us your preferred stream, budget range, and location.",
        bg: "bg-blue-50",
        color: "text-blue-700",
    },
    {
        icon: Sparkles,
        title: "Get AI recommendations",
        description: "Our AI matches you with real schools from our database and explains why each one fits.",
        bg: "bg-purple-50",
        color: "text-purple-700",
    },
    {
        icon: Scale,
        title: "Compare & save",
        description: "Shortlist schools you like, and compare up to 3 side by side.",
        bg: "bg-green-50",
        color: "text-green-700",
    },
    {
        icon: MessageSquare,
        title: "Contact schools directly",
        description: "Send an inquiry to any school and track their response, all from your dashboard.",
        bg: "bg-amber-50",
        color: "text-amber-700",
    },
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicNav />
            <main className="mx-auto max-w-3xl px-6 py-16">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    How it works
                </span>
                <h1 className="mt-4 text-3xl font-bold text-gray-900">Four simple steps</h1>
                <p className="mt-4 text-gray-600">
                    From first search to sending an inquiry, here&apos;s how SikhshaSathi helps you find the
                    right school.
                </p>

                <div className="mt-10 space-y-6">
                    {STEPS.map((step, index) => (
                        <div key={step.title} className="flex gap-4 rounded-xl border border-gray-100 p-5">
                            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${step.bg}`}>
                                <step.icon className={`h-5 w-5 ${step.color}`} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-gray-400">STEP {index + 1}</p>
                                <p className="mt-0.5 text-base font-semibold text-gray-900">{step.title}</p>
                                <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
                SikhshaSathi &mdash; Find the best school for a bright future
            </footer>
        </div>
    );
}