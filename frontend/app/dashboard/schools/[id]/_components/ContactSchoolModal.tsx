"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { X, MessageSquare } from "lucide-react";
import { handleCreateInquiry } from "@/lib/actions/inquiry-action";

interface Props {
    schoolId: string;
    schoolName: string;
    studentName: string;
    onClose: () => void;
}

const MAX_LENGTH = 500;

export default function ContactSchoolModal({ schoolId, schoolName, studentName, onClose }: Props) {
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim().length < 2) {
            toast.error("Please write a short message");
            return;
        }
        startTransition(async () => {
            const result = await handleCreateInquiry(schoolId, message.trim());
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message || "Inquiry sent successfully");
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Contact {schoolName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Your name</label>
                        <input
                            type="text"
                            value={studentName}
                            disabled
                            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
                            rows={4}
                            placeholder="Ask about admissions, fees, facilities..."
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        <p className="mt-1 text-right text-xs text-gray-400">{message.length}/{MAX_LENGTH}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                    >
                        <MessageSquare className="h-4 w-4" />
                        {isPending ? "Sending..." : "Send inquiry"}
                    </button>
                </form>
            </div>
        </div>
    );
}