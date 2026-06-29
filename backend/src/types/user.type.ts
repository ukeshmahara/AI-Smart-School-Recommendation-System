import { z } from "zod";

export const UserSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().min(7, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["admin", "student"]).default("student"),
});

export type UserType = z.infer<typeof UserSchema>;
