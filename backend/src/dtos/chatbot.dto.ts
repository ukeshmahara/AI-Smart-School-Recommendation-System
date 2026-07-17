import { z } from "zod";

export const SendChatMessageDTO = z.object({
    message: z.string().min(1, "Message cannot be empty").max(1000, "Keep your message under 1000 characters"),
});
export type SendChatMessageDTO = z.infer<typeof SendChatMessageDTO>;