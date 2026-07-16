"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Star, Trash2, MessageSquare } from "lucide-react";
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
            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                            <th className="px-4 py-3 font-medium">Student</th>
                            <th className="px-4 py-3 font-medium">School</th>
                            <th className="px-4 py-3 font-medium">Rating</th>
                            <th className="px-4 py-3 font-medium">Comment</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900">{review.studentId?.fullName || "Deleted user"}</p>
                                    <p className="text-xs text-gray-400">{review.studentId?.email}</p>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{review.schoolId?.name || "Deleted school"}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-3.5 w-3.5 ${
                                                    star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="max-w-[240px] px-4 py-3 text-gray-600">
                                    <p className="truncate">{review.comment}</p>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => setDeletingId(review._id)}
                                        aria-label="Delete review"
                                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deletingId && (
                <DeleteReviewModal isDeleting={isDeleting} onCancel={() => setDeletingId(null)} onConfirm={confirmDelete} />
            )}
        </>
    );
}