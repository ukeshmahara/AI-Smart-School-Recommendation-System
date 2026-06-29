import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        fullName: z.string().min(2, "Enter your full name"),
        email: z.email("Enter a valid email address"),
        phone: z.string().min(7, "Enter a valid phone number"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export type RegisterFormData = z.infer<typeof registerSchema>;
