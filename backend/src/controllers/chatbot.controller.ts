import { Request, Response } from "express";
import { z } from "zod";
import { ChatbotService } from "../services/chatbot.service";
import { SendChatMessageDTO } from "../dtos/chatbot.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";

const chatbotService = new ChatbotService();

export class ChatbotController {
    async getHistory(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id;
            const messages = await chatbotService.getHistory(userId);
            return ApiResponseHelper.success(res, messages, "Chat history fetched successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async sendMessage(req: Request, res: Response) {
        try {
            const parsed = SendChatMessageDTO.safeParse(req.body);
            if (!parsed.success) {
                return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
            }
            const userId = (req.user as any)._id;
            const reply = await chatbotService.sendMessage(userId, parsed.data.message);
            return ApiResponseHelper.success(res, reply, "Message sent successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }

    async clearHistory(req: Request, res: Response) {
        try {
            const userId = (req.user as any)._id;
            await chatbotService.clearHistory(userId);
            return ApiResponseHelper.success(res, null, "Chat history cleared successfully");
        } catch (error: Error | any) {
            return ApiResponseHelper.error(res, error.message || "Internal Server Error", error.status || 500);
        }
    }
}