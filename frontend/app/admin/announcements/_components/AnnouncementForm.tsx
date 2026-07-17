"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { handleCreateNotification } from "@/lib/actions/admin/notification-action";

interface FormData {
    title: string;
    message: string;
    type: "general" | "wish" | "important";
}

export default function AnnouncementForm({ onSent }: { onSent: () => void }) {
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormData>({ defaultValues: { type: "general" } });

    const titleValue = watch("title") || "";
    const messageValue = watch("message") || "";

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            const result = await handleCreateNotification(data);
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            toast.success(result.message || "Notification sent successfully");
            reset();
            onSent();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-gray-100 bg-white p-5">
            <h2 className="text-sm font-bold text-gray-900">Send a notification</h2>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    maxLength={80}
                    {...register("title", { required: true, minLength: 2, maxLength: 80 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                />
                <div className="mt-1 flex items-center justify-between">
                    {errors.title && <p className="text-xs text-red-600">Title is required (max 80 characters)</p>}
                    <p className="ml-auto text-xs text-gray-400">{titleValue.length}/80</p>
                </div>
            </div>
            <div>
                <textarea
                    placeholder="Message"
                    rows={2}
                    maxLength={300}
                    {...register("message", { required: true, minLength: 2, maxLength: 300 })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                />
                <div className="mt-1 flex items-center justify-between">
                    {errors.message && <p className="text-xs text-red-600">Message is required (max 300 characters)</p>}
                    <p className="ml-auto text-xs text-gray-400">{messageValue.length}/300</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <select
                    {...register("type")}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600"
                >
                    <option value="general">General</option>
                    <option value="wish">Wish</option>
                    <option value="important">Important</option>
                </select>
                <button
                    type="submit"
                    disabled={isPending}
                    className="ml-auto rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                    {isPending ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
}