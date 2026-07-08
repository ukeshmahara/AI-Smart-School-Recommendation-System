"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { handleAddFavorite, handleRemoveFavorite } from "@/lib/actions/favorite-action";

interface Props {
    schoolId: string;
    initialFavorited: boolean;
    size?: "sm" | "md";
}

export default function FavoriteButton({ schoolId, initialFavorited, size = "md" }: Props) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isPending, startTransition] = useTransition();

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const nextState = !isFavorited;
        setIsFavorited(nextState); // optimistic update

        startTransition(async () => {
            const result = nextState ? await handleAddFavorite(schoolId) : await handleRemoveFavorite(schoolId);

            if (!result.success) {
                setIsFavorited(!nextState); // revert on failure
                toast.error(result.message);
            }
        });
    };

    const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";

    return (
        <button
            onClick={toggleFavorite}
            disabled={isPending}
            aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
            className={`flex ${buttonSize} shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:opacity-60`}
        >
            <Heart
                className={`${iconSize} transition-colors ${
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
            />
        </button>
    );
}