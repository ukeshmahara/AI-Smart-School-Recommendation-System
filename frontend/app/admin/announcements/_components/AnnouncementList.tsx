"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Bell as BellIcon, Trash2 } from "lucide-react";
import { handleDeleteNotification } from "@/lib/actions/admin/notification-action";
import DeleteNotificationModal from "./DeleteNotificationModal";

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
}

export default function AnnouncementList({ notifications }: { notifications: Notification[] }) {
    const router = useRouter();
    const [deletingNotification, setDeletingNotification] = useState<Notification | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!deletingNotification) return;
        setIsDeleting(true);
        const result = await handleDeleteNotification(deletingNotification._id);
        setIsDeleting(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        toast.success(result.message || "Notification deleted successfully");
        setDeletingNotification(null);
        router.refresh();
    };

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                <BellIcon className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">No notifications sent yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {notifications.map((n) => (
                <div
                    key={n._id}
                    className="flex items-start justify-between rounded-xl border border-gray-100 bg-white p-4"
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                                {n.type}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{n.message}</p>
                        <p className="mt-2 text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => setDeletingNotification(n)}
                        aria-label="Delete notification"
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ))}

            {deletingNotification && (
                <DeleteNotificationModal
                    notification={deletingNotification}
                    isDeleting={isDeleting}
                    onCancel={() => setDeletingNotification(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}