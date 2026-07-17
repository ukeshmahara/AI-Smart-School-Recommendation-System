import { z } from "zod";

export const NotificationSchema = z.object({
    title: z.string().min(2, "Title is required").max(80, "Keep the title under 80 characters"),
    message: z.string().min(2, "Message is required").max(300, "Keep the message under 300 characters"),
    type: z.enum(["general", "wish", "important"]).default("general"),
});

export type NotificationType = z.infer<typeof NotificationSchema>;