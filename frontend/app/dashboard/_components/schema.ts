import { z } from "zod";

export const profileSchema = z.object({
    fullName: z.string().min(2, "Enter your full name"),
    phone: z.string().min(7, "Enter a valid phone number"),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, "Enter your current password"),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
        confirmNewPassword: z.string().min(6, "Confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    });
export type PasswordFormData = z.infer<typeof passwordSchema>;