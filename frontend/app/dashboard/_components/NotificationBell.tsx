"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Gift, AlertTriangle, Megaphone } from "lucide-react";
import { handleGetRecentNotifications } from "@/lib/actions/notification-action";

const TYPE_META: Record<string, { icon: any; color: string }> = {
    general: { icon: Megaphone, color: "text-blue-700" },
    wish: { icon: Gift, color: "text-pink-600" },
    important: { icon: AlertTriangle, color: "text-amber-600" },
};

function timeAgo(dateStr: string) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const togglePanel = async () => {
        const next = !isOpen;
        setIsOpen(next);
        if (next && !loaded) {
            const result = await handleGetRecentNotifications();
            setNotifications(result.data);
            setLoaded(true);
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={togglePanel}
                aria-label="Notifications"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
                <Bell className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="border-b border-gray-100 p-3">
                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-6 text-center text-sm text-gray-400">No notifications yet</p>
                        ) : (
                            notifications.map((n) => {
                                const meta = TYPE_META[n.type] || TYPE_META.general;
                                const Icon = meta.icon;
                                return (
                                    <div key={n._id} className="flex gap-3 border-b border-gray-50 p-3 last:border-0">
                                        <Icon className={`h-4 w-4 shrink-0 ${meta.color}`} />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                                            <p className="mt-0.5 text-xs text-gray-500">{n.message}</p>
                                            <p className="mt-1 text-[11px] text-gray-400">{timeAgo(n.createdAt)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}