import Link from "next/link";
import { MessageSquare, MapPin, CornerDownRight } from "lucide-react";
import { handleGetMyInquiries } from "@/lib/actions/inquiry-action";
import { getImageUrl } from "@/lib/image-url";

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: "Pending", bg: "bg-amber-50", color: "text-amber-700" },
    responded: { label: "Responded", bg: "bg-blue-50", color: "text-blue-700" },
    closed: { label: "Closed", bg: "bg-gray-100", color: "text-gray-500" },
};

export default async function MyInquiriesPage() {
    const result = await handleGetMyInquiries();
    const inquiries = result.data;

    return (
        <main className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">My Inquiries</h1>

            {inquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-16 text-center">
                    <MessageSquare className="h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">You haven&apos;t contacted any schools yet</p>
                    <Link href="/dashboard/schools" className="mt-2 text-sm font-semibold text-blue-700 hover:underline">
                        Browse schools
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {inquiries.map((inquiry: any) => {
                        const school = inquiry.schoolId;
                        const status = STATUS_META[inquiry.status] || STATUS_META.pending;
                        return (
                            <div key={inquiry._id} className="rounded-xl border border-gray-100 bg-white p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            {school?.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={getImageUrl(school.image)}
                                                    alt={school.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {school?.name || "School removed"}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.color}`}
                                    >
                                        {status.label}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-gray-600">{inquiry.message}</p>

                                {inquiry.adminReply && (
                                    <div className="mt-3 flex gap-2 rounded-lg bg-blue-50 p-3">
                                        <CornerDownRight className="h-4 w-4 shrink-0 text-blue-600" />
                                        <div>
                                            <p className="text-xs font-semibold text-blue-700">School&apos;s response</p>
                                            <p className="mt-0.5 text-sm text-blue-900">{inquiry.adminReply}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}