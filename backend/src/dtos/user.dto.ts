import { z } from "zod";
import { UserSchema } from "../types/user.type";

export const CreateUserDTO = UserSchema.pick({
    fullName: true,
    email: true,
    phone: true,
    password: true,
});
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = UserSchema.pick({ email: true, password: true });
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDTO = z
    .object({
        fullName: z.string().min(2, "Full name is required").optional(),
        phone: z.string().min(7, "Invalid phone number").optional(),
        currentPassword: z.string().min(6, "Current password is required").optional(),
        newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
    })
    .refine((data) => !data.newPassword || !!data.currentPassword, {
        message: "Current password is required to set a new password",
        path: ["currentPassword"],
    });
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;