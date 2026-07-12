import { LucideIcon } from "lucide-react";

interface Props {
    label: string;
    value: string | number;
    icon: LucideIcon;
    bg: string;
    color: string;
}

export default function StatCard({ label, value, icon: Icon, bg, color }: Props) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
            </span>
            <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
}