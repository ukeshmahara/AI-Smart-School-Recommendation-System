"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MessageSquare, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { handleUpdateInquiryStatus, handleReplyToInquiry, handleDeleteInquiry } from "@/lib/actions/admin/inquiry-action";
import DeleteInquiryModal from "./DeleteInquiryModal";

interface Inquiry {
    _id: string;
    studentId: { fullName: string; email: string } | null;
    schoolId: { name: string } | null;
    message: string;
    adminReply?: string;
    status: string;
    createdAt: string;
}

const STATUS_META: Record<string, { bg: string; color: string }> = {
    pending: { bg: "bg-amber-50", color: "text-amber-700" },
    responded: { bg: "bg-blue-50", color: "text-blue-700" },
    closed: { bg: "bg-gray-100", color: "text-gray-500" },
};

export default function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
    const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

    const onStatusChange = async (id: string, status: string) => {
        const result = await handleUpdateInquiryStatus(id, status);
        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message || "Status updated successfully");
        router.refresh();
    };

    const toggleExpand = (inquiry: Inquiry) => {
        setExpandedId(expandedId === inquiry._id ? null : inquiry._id);
        setReplyDrafts((prev) => ({ ...prev, [inquiry._id]: prev[inquiry._id] ?? inquiry.adminReply ?? "" }));
    };

    const sendReply = async (id: string) => {
        const reply = (replyDrafts[id] || "").trim();
        if (reply.length < 2) {
            toast.error("Write a reply first");
            return;
        }
        setSendingReplyId(id);
        const result = await handleReplyToInquiry(id, reply);
        setSendingReplyId(null);

        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message || "Reply sent successfully");
        router.refresh();
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        const result = await handleDeleteInquiry(deletingId);
        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message || "Inquiry deleted successfully");
        setDeletingId(null);
        router.refresh();
    };

    if (inquiries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <MessageSquare className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No inquiries yet</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {inquiries.map((inquiry) => {
                    const status = STATUS_META[inquiry.status] || STATUS_META.pending;
                    const isExpanded = expandedId === inquiry._id;
                    return (
                        <div key={inquiry._id} className="rounded-xl border border-gray-100 bg-white">
                            <div
                                onClick={() => toggleExpand(inquiry)}
                                className="flex cursor-pointer items-start justify-between gap-3 p-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-gray-900">
                                            {inquiry.studentId?.fullName || "Deleted user"}
                                        </p>
                                        <span className="text-xs text-gray-400">&rarr; {inquiry.schoolId?.name || "Deleted school"}</span>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-gray-600">{inquiry.message}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <select
                                        value={inquiry.status}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => onStatusChange(inquiry._id, e.target.value)}
                                        className={`rounded-full border-none px-2.5 py-1 text-xs font-semibold outline-none ${status.bg} ${status.color}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="responded">Responded</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingId(inquiry._id);
                                        }}
                                        aria-label="Delete inquiry"
                                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    {isExpanded ? (
                                        <ChevronUp className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="border-t border-gray-100 p-4">
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Full message
                                    </p>
                                    <p className="mb-3 text-sm text-gray-700">{inquiry.message}</p>

                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Your reply
                                    </p>
                                    <textarea
                                        rows={3}
                                        maxLength={500}
                                        value={replyDrafts[inquiry._id] ?? ""}
                                        onChange={(e) =>
                                            setReplyDrafts((prev) => ({ ...prev, [inquiry._id]: e.target.value }))
                                        }
                                        placeholder="Write a reply the student will see..."
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                                    />
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            onClick={() => sendReply(inquiry._id)}
                                            disabled={sendingReplyId === inquiry._id}
                                            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                                        >
                                            {sendingReplyId === inquiry._id ? "Sending..." : "Send reply"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {deletingId && (
                <DeleteInquiryModal
                    isDeleting={isDeleting}
                    onCancel={() => setDeletingId(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </>
    );
}