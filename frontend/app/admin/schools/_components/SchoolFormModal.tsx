"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { X, School as SchoolIcon, Camera } from "lucide-react";
import { schoolSchema, SchoolFormData, CATEGORY_OPTIONS, STREAM_OPTIONS } from "./schema";
import { handleCreateSchool, handleUpdateSchool } from "@/lib/actions/admin/school-action";
import { AdminSchool } from "./SchoolManagementPanel";
import { getImageUrl } from "@/lib/image-url";

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
        getImageUrl(school?.image) ?? null
    );

    const {
        register,
        control,
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
                  description: school!.description || "",
                  facilitiesText: school!.facilities?.join(", ") || "",
                  phone: school!.contactPhone || "",
                  email: school!.contactEmail || "",
                  website: school!.contactWebsite || "",
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
            if (data.description) formData.append("description", data.description);
            if (data.phone) formData.append("contactPhone", data.phone);
            if (data.email) formData.append("contactEmail", data.email);
            if (data.website) formData.append("contactWebsite", data.website);

            const facilitiesArray = (data.facilitiesText || "")
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);
            facilitiesArray.forEach((f) => formData.append("facilities", f));

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
            <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 p-5">
                    <h2 className="text-lg font-bold text-gray-900">{isEdit ? "Edit School" : "Add School"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-3 overflow-y-auto p-5">
                        <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {previewUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={previewUrl} alt="School" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <SchoolIcon className="h-5 w-5" />
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
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-900">Location</label>
                            <input
                                type="text"
                                {...register("location")}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                            />
                            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-900">Category</label>
                                <select
                                    {...register("category")}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                                >
                                    {CATEGORY_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-900">Annual Fees (Rs)</label>
                                <input
                                    type="number"
                                    {...register("fees", { valueAsNumber: true })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                                />
                                {errors.fees && <p className="mt-1 text-xs text-red-600">{errors.fees.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-900">Streams Offered</label>
                            <Controller
                                control={control}
                                name="streamsOffered"
                                render={({ field }) => {
                                    const selected = field.value || [];
                                    const toggleStream = (value: string) => {
                                        if (selected.includes(value as any)) {
                                            field.onChange(selected.filter((s) => s !== value));
                                        } else {
                                            field.onChange([...selected, value]);
                                        }
                                    };
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {STREAM_OPTIONS.map((opt) => (
                                                <label
                                                    key={opt.value}
                                                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(opt.value as any)}
                                                        onChange={() => toggleStream(opt.value)}
                                                        className="h-4 w-4"
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    );
                                }}
                            />
                            {errors.streamsOffered && (
                                <p className="mt-1 text-xs text-red-600">{errors.streamsOffered.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-900">Description</label>
                            <textarea
                                {...register("description")}
                                rows={2}
                                placeholder="A short overview of the school..."
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-900">Facilities</label>
                            <input
                                type="text"
                                {...register("facilitiesText")}
                                placeholder="Library, Sports ground, Science labs"
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                            />
                            <p className="mt-1 text-xs text-gray-400">Separate each facility with a comma</p>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                            <p className="mb-2 text-sm font-semibold text-gray-900">Contact Information</p>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    {...register("phone")}
                                    placeholder="Phone number"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                                />
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="Admissions email"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                            <input
                                type="text"
                                {...register("website")}
                                placeholder="Website (e.g. https://school.edu.np)"
                                className="mt-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white"
                            />
                            {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website.message}</p>}
                        </div>
                    </div>

                    <div className="flex gap-3 border-t border-gray-100 p-5">
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