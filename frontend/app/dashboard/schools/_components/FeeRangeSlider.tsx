"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { MIN_FEE, MAX_FEE } from "./constants";

const STEP = 5000;
const MIN_GAP = 10000;

function formatFee(value: number) {
    if (value >= MAX_FEE) return "Rs 1,500,000+";
    return `Rs ${value.toLocaleString()}`;
}

interface Props {
    initialMin: number;
    initialMax: number;
    onChangeCommitted: (min: number, max: number) => void;
}

export default function FeeRangeSlider({ initialMin, initialMax, onChangeCommitted }: Props) {
    const [minVal, setMinVal] = useState(initialMin);
    const [maxVal, setMaxVal] = useState(initialMax);
    const trackRef = useRef<HTMLDivElement>(null);
    const minRef = useRef(minVal);
    const maxRef = useRef(maxVal);
    const draggingRef = useRef<"min" | "max" | null>(null);

    useEffect(() => {
        minRef.current = minVal;
    }, [minVal]);
    useEffect(() => {
        maxRef.current = maxVal;
    }, [maxVal]);

    useEffect(() => {
        const valueFromClientX = (clientX: number) => {
            const track = trackRef.current;
            if (!track) return MIN_FEE;
            const rect = track.getBoundingClientRect();
            const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            const raw = MIN_FEE + ratio * (MAX_FEE - MIN_FEE);
            return Math.round(raw / STEP) * STEP;
        };

        const handleMove = (e: PointerEvent) => {
            if (!draggingRef.current) return;
            const value = valueFromClientX(e.clientX);
            if (draggingRef.current === "min") {
                const next = Math.min(value, maxRef.current - MIN_GAP);
                setMinVal(Math.max(next, MIN_FEE));
            } else {
                const next = Math.max(value, minRef.current + MIN_GAP);
                setMaxVal(Math.min(next, MAX_FEE));
            }
        };

        const handleUp = () => {
            if (draggingRef.current) {
                draggingRef.current = null;
                onChangeCommitted(minRef.current, maxRef.current);
            }
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startDrag = (which: "min" | "max") => (e: React.PointerEvent) => {
        e.preventDefault();
        draggingRef.current = which;
    };

    const minPercent = ((minVal - MIN_FEE) / (MAX_FEE - MIN_FEE)) * 100;
    const maxPercent = ((maxVal - MIN_FEE) / (MAX_FEE - MIN_FEE)) * 100;

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                    <SlidersHorizontal className="h-4 w-4 text-blue-700" />
                    Fee range (Rs / year)
                </span>
                <span className="text-xs text-gray-500">
                    {formatFee(minVal)} &ndash; {formatFee(maxVal)}
                </span>
            </div>

            <div ref={trackRef} className="relative mx-1 mb-2 mt-6 h-1.5 rounded-full bg-gray-100">
                <div
                    className="absolute h-1.5 rounded-full bg-blue-600"
                    style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                />
                <div
                    onPointerDown={startDrag("min")}
                    role="slider"
                    tabIndex={0}
                    aria-label="Minimum fee"
                    aria-valuemin={MIN_FEE}
                    aria-valuemax={MAX_FEE}
                    aria-valuenow={minVal}
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white bg-blue-600 shadow-md active:cursor-grabbing"
                    style={{ left: `${minPercent}%`, cursor: "grab" }}
                />
                <div
                    onPointerDown={startDrag("max")}
                    role="slider"
                    tabIndex={0}
                    aria-label="Maximum fee"
                    aria-valuemin={MIN_FEE}
                    aria-valuemax={MAX_FEE}
                    aria-valuenow={maxVal}
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border-2 border-white bg-blue-600 shadow-md active:cursor-grabbing"
                    style={{ left: `${maxPercent}%`, cursor: "grab" }}
                />
            </div>

            <div className="flex justify-between text-[11px] text-gray-400">
                <span>Rs 0</span>
                <span>Rs 1,500,000+</span>
            </div>
        </div>
    );
}