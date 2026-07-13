import { z } from "zod";
import { NotificationSchema } from "../types/notification.type";

export const CreateNotificationDTO = NotificationSchema.pick({
    title: true,
    message: true,
    type: true,
});
export type CreateNotificationDTO = z.infer<typeof CreateNotificationDTO>;