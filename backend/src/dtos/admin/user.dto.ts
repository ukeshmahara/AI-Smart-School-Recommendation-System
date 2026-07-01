import { z } from "zod";
import { UserSchema } from "../../types/user.type";

export const AdminCreateUserDTO = UserSchema.pick({
    fullName: true,
    email: true,
    phone: true,
    password: true,
    role: true,
});
export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

export const AdminUpdateUserDTO = z.object({
    fullName: z.string().min(2, "Full name is required").optional(),
    email: z.email("Invalid email address").optional(),
    phone: z.string().min(7, "Invalid phone number").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    role: z.enum(["admin", "student"]).optional(),
});
export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserDTO>;