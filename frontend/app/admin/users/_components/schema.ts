import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z.string().min(2, "Enter a full name"),
    email: z.email("Enter a valid email address"),
    phone: z.string().min(7, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "student"]),
});
export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
    fullName: z.string().min(2, "Enter a full name"),
    email: z.email("Enter a valid email address"),
    phone: z.string().min(7, "Enter a valid phone number"),
    password: z.union([z.string().min(6, "Password must be at least 6 characters"), z.literal("")]).optional(),
    role: z.enum(["admin", "student"]),
});
export type EditUserFormData = z.infer<typeof editUserSchema>;