"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
    data: Record<string, number>;
}

const LABELS: Record<string, string> = {
    international: "International",
    public: "Public",
    private: "Private",
    budget_friendly: "Budget-Friendly",
};

export default function CategoryBarChart({ data }: Props) {
    const chartData = Object.entries(data).map(([key, value]) => ({
        name: LABELS[key] || key,
        count: value,
    }));

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-bold text-gray-900">Schools by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}