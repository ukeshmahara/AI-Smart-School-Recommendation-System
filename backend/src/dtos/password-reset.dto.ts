import { z } from "zod";

export const ForgotPasswordDTO = z.object({
    email: z.email("Enter a valid email address"),
});
export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTO>;

export const ResetPasswordDTO = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTO>;