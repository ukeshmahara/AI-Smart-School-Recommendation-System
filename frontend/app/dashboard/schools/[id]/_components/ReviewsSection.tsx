"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { Star, Pencil, Trash2 } from "lucide-react";
import {
    handleGetSchoolReviews,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
} from "@/lib/actions/review-action";
import StarRatingInput from "./StarRatingInput";

interface Review {
    _id: string;
    studentId: { _id: string; fullName: string } | null;
    rating: number;
    comment: string;
    createdAt: string;
}

function timeAgo(dateStr: string) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 1) return "today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString();
}

export default function ReviewsSection({ schoolId, currentUserId }: { schoolId: string; currentUserId?: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [summary, setSummary] = useState({ average: 0, count: 0 });
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const loadReviews = async () => {
        const result = await handleGetSchoolReviews(schoolId);
        setReviews(result.data.reviews);
        setSummary(result.data.summary);
    };

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schoolId]);

    const resetForm = () => {
        setRating(0);
        setComment("");
        setEditingId(null);
    };

    const onSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }
        if (comment.trim().length < 2) {
            toast.error("Please write a short comment");
            return;
        }
        startTransition(async () => {
            const result = editingId
                ? await handleUpdateReview(editingId, rating, comment.trim())
                : await handleCreateReview(schoolId, rating, comment.trim());

            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message || (editingId ? "Review updated successfully" : "Review posted successfully"));
            resetForm();
            loadReviews();
        });
    };

    const startEdit = (review: Review) => {
        setEditingId(review._id);
        setRating(review.rating);
        setComment(review.comment);
    };

    const onDelete = async (id: string) => {
        const result = await handleDeleteReview(id);
        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message || "Review deleted successfully");
        loadReviews();
    };

    return (
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Reviews</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">{summary.average || "-"}</p>
                    <div className="my-1 flex justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${
                                    star <= Math.round(summary.average)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">Based on {summary.count} reviews</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900">
                        {editingId ? "Edit your review" : "Share your experience"}
                    </p>
                    <StarRatingInput value={rating} onChange={setRating} />
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 500))}
                        rows={2}
                        placeholder="What was your experience with this school?"
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
                    />
                    <div className="mt-2 flex gap-2">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={isPending}
                            className="ml-auto rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                        >
                            {isPending ? "Saving..." : editingId ? "Update review" : "Post review"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-4 space-y-3">
                {reviews.length === 0 ? (
                    <p className="py-6 text-center text-sm text-gray-400">No reviews yet. Be the first to share your experience.</p>
                ) : (
                    reviews.map((review) => {
                        const isOwn = currentUserId && review.studentId?._id === currentUserId;
                        return (
                            <div key={review._id} className="rounded-lg border border-gray-100 p-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                                            {review.studentId?.fullName?.charAt(0) || "?"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {review.studentId?.fullName || "Deleted user"}
                                                {isOwn && <span className="ml-1 text-xs font-normal text-gray-400">(you)</span>}
                                            </p>
                                            <div className="flex items-center gap-1">
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
                                                <span className="ml-1 text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {isOwn && (
                                        <div className="flex gap-1">
                                            <button onClick={() => startEdit(review)} aria-label="Edit review" className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-700">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => onDelete(review._id)} aria-label="Delete review" className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}