"use client";

import { useRouter } from "next/navigation";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementList from "./AnnouncementList";
import Pagination from "./Pagination";

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AnnouncementsPanel({
    initialNotifications,
    meta,
}: {
    initialNotifications: Notification[];
    meta: Meta;
}) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <AnnouncementForm onSent={() => router.refresh()} />
            <AnnouncementList notifications={initialNotifications} />
            <Pagination meta={meta} />
        </div>
    );
}