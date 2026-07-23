"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { User, Phone, Camera } from "lucide-react";
import { profileSchema, ProfileFormData } from "../../_components/schema";
import { handleUpdateUser } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getImageUrl } from "@/lib/image-url";

interface ProfileFormProps {
    user: {
        fullName: string;
        email: string;
        phone: string;
        profileImage?: string;
    };
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        getImageUrl(user.profileImage) ?? null
    );
    const { checkAuth } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: { fullName: user.fullName, phone: user.phone },
    });

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onSubmit = (data: ProfileFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("phone", data.phone);
            if (imageFile) formData.append("profileImage", imageFile);

            const result = await handleUpdateUser(formData);

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success(result.message || "Profile updated successfully");
            await checkAuth();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-gray-100 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">Profile details</h2>

            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <User className="h-8 w-8" />
                        </div>
                    )}
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <Camera className="h-4 w-4" />
                    Change photo
                    <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                </label>
            </div>

            <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-gray-900">
                    Full Name
                </label>
                <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        id="fullName"
                        type="text"
                        {...register("fullName")}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                    />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Email</label>
                <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 py-3 px-4 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
            </div>

            <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-900">
                    Phone Number
                </label>
                <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 outline-none transition-colors focus:border-blue-600 focus:bg-white"
                    />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
            >
                {isPending ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}