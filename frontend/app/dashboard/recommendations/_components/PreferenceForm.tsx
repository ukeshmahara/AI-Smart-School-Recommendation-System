"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Sparkles } from "lucide-react";
import FeeRangeSlider from "../../schools/_components/FeeRangeSlider";
import { handleGetRecommendations } from "@/lib/actions/recommendation-action";

const STREAMS = [
    { value: "science", label: "Science" },
    { value: "management", label: "Management" },
    { value: "humanities", label: "Humanities" },
];

export default function PreferenceForm() {
    const [stream, setStream] = useState<string>("science");
    const [minFee, setMinFee] = useState(0);
    const [maxFee, setMaxFee] = useState(1500000);
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await handleGetRecommendations({
                stream: stream as any,
                minFee,
                maxFee,
                location: location || undefined,
                notes: notes || undefined,
            });

            if (!result.success) {
                toast.error(result.message || "Something went wrong");
                return;
            }

            sessionStorage.setItem("recommendationResult", JSON.stringify(result.data));
            router.push("/dashboard/recommendations/results");
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-700" />
                <h2 className="text-lg font-bold text-gray-900">Tell us what you&apos;re looking for</h2>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Preferred stream</label>
                <div className="flex gap-2">
                    {STREAMS.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => setStream(s.value)}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                stream === s.value
                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            <FeeRangeSlider
                initialMin={minFee}
                initialMax={maxFee}
                onChangeCommitted={(min, max) => {
                    setMinFee(min);
                    setMaxFee(max);
                }}
            />

            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Preferred location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kathmandu, Lalitpur..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Anything else that matters to you?</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                    rows={2}
                    placeholder="e.g. good sports facilities, small class sizes..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                />
                <p className="mt-1 text-right text-xs text-gray-400">{notes.length}/300</p>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
                <Sparkles className="h-4 w-4" />
                {isPending ? "Finding your matches (this can take up to 20 seconds)..." : "Get my recommendations"}
            </button>
        </form>
    );
}