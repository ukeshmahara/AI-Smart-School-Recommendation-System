"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { X, School as SchoolIcon, Camera } from "lucide-react";
import { schoolSchema, SchoolFormData, CATEGORY_OPTIONS, STREAM_OPTIONS } from "./schema";
import { handleCreateSchool, handleUpdateSchool } from "@/lib/actions/admin/school-action";
import { AdminSchool } from "./SchoolManagementPanel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

interface Props {
    school: AdminSchool | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SchoolFormModal({ school, onClose, onSuccess }: Props) {
    const isEdit = !!school;
    const [isPending, startTransition] = useTransition();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        school?.image ? `${API_BASE_URL}${school.image}` : null
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SchoolFormData>({
        resolver: zodResolver(schoolSchema),
        defaultValues: isEdit
            ? {
                  name: school!.name,
                  location: school!.location,
                  category: school!.category,
                  streamsOffered: school!.streamsOffered,
                  fees: school!.fees,
              }
            : { category: "public", streamsOffered: [] },
    });

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = (data: SchoolFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("location", data.location);
            formData.append("category", data.category);
            data.streamsOffered.forEach((stream) => formData.append("streamsOffered", stream));
            formData.append("fees", String(data.fees));
            if (imageFile) formData.append("image", imageFile);

            const result = isEdit
                ? await handleUpdateSchool(school!._id, formData)
                : await handleCreateSchool(formData);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message || (isEdit ? "School updated successfully" : "School created successfully"));
            onSuccess();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit School" : "Add School"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            {previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt="School" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <SchoolIcon className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                            <Camera className="h-4 w-4" />
                            Upload photo
                            <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                        </label>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">School Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Location</label>
                        <input
                            type="text"
                            {...register("location")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Category</label>
                        <select
                            {...register("category")}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        >
                            {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-900">Streams Offered</label>
                        <div className="flex flex-wrap gap-3">
                            {STREAM_OPTIONS.map((opt) => (
                                <label
                                    key={opt.value}
                                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
                                >
                                    <input type="checkbox" value={opt.value} {...register("streamsOffered")} className="h-4 w-4" />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                        {errors.streamsOffered && (
                            <p className="mt-1 text-xs text-red-600">{errors.streamsOffered.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-gray-900">Annual Fees (Rs)</label>
                        <input
                            type="number"
                            {...register("fees", { valueAsNumber: true })}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                        />
                        {errors.fees && <p className="mt-1 text-xs text-red-600">{errors.fees.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 rounded-lg bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                        >
                            {isPending ? "Saving..." : isEdit ? "Save changes" : "Create school"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}