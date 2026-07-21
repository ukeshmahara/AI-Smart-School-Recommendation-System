"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Star, Trash2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { handleDeleteReview } from "@/lib/actions/admin/review-action";
import DeleteReviewModal from "./DeleteReviewModal";

interface Review {
    _id: string;
    studentId: { fullName: string; email: string } | null;
    schoolId: { name: string } | null;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewTable({ reviews }: { reviews: Review[] }) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const confirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        const result = await handleDeleteReview(deletingId);
        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message || "Review deleted successfully");
        setDeletingId(null);
        router.refresh();
    };

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <MessageSquare className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No reviews yet</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {reviews.map((review) => {
                    const isExpanded = expandedId === review._id;
                    return (
                        <div key={review._id} className="rounded-xl border border-gray-100 bg-white">
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : review._id)}
                                className="flex cursor-pointer items-start justify-between gap-3 p-4 hover:bg-gray-50"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-gray-900">
                                            {review.studentId?.fullName || "Deleted user"}
                                        </p>
                                        <span className="text-xs text-gray-400">
                                            &rarr; {review.schoolId?.name || "Deleted school"}
                                        </span>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${
                                                        star <= review.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-1 truncate text-sm text-gray-600">{review.comment}</p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeletingId(review._id);
                                        }}
                                        aria-label="Delete review"
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
                                <div className="border-t border-gray-100 bg-gray-50 p-4">
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Full comment
                                    </p>
                                    <p className="text-sm text-gray-700">{review.comment}</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Posted {new Date(review.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {deletingId && (
                <DeleteReviewModal isDeleting={isDeleting} onCancel={() => setDeletingId(null)} onConfirm={confirmDelete} />
            )}
        </>
    );
}