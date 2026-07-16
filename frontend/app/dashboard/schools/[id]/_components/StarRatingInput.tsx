"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
    value: number;
    onChange: (value: number) => void;
}

export default function StarRatingInput({ value, onChange }: Props) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                    <Star
                        className={`h-6 w-6 ${
                            star <= (hovered || value) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}