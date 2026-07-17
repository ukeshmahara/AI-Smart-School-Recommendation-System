import { ChatMessageMongoRepository } from "../repositories/chatMessage.repository";
import { geminiClient, GEMINI_MODEL } from "../configs/gemini";

const chatMessageRepository = new ChatMessageMongoRepository();
const HISTORY_LIMIT = 8;
const MAX_RETRIES = 1;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const SYSTEM_INSTRUCTION = `You are the SikhshaSathi Assistant, a friendly chatbot on the SikhshaSathi school
recommendation platform for students in Nepal. You can help with school-related questions, general knowledge
questions, and casual conversation. Keep answers concise, warm, and use occasional emojis where natural.`;

export class ChatbotService {
    async getHistory(userId: string) {
        return chatMessageRepository.findByUser(userId);
    }

    async sendMessage(userId: string, message: string) {
        const priorMessages = await chatMessageRepository.findByUser(userId);
        const recentHistory = priorMessages.slice(-HISTORY_LIMIT);

        const contents = [
            ...recentHistory.map((m) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        // Always save the user's message first, even if the AI call fails below
        await chatMessageRepository.create({ userId: userId as any, role: "user", content: message });

        let replyText: string;
        try {
            replyText = await this.callGeminiWithRetry(contents);
        } catch (error) {
            console.error("Chatbot Gemini call failed after retries:", error);
            replyText =
                "Sorry, I'm having trouble responding right now due to high demand. Please try again in a moment.";
        }

        const assistantMessage = await chatMessageRepository.create({
            userId: userId as any,
            role: "assistant",
            content: replyText,
        });

        return assistantMessage;
    }

    private async callGeminiWithRetry(contents: any[]): Promise<string> {
        let lastError: any;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await geminiClient.models.generateContent({
                    model: GEMINI_MODEL,
                    contents,
                    config: {
                        systemInstruction: SYSTEM_INSTRUCTION,
                    },
                });
                return response.text || "Sorry, I couldn't come up with a response. Please try again.";
            } catch (error: any) {
                lastError = error;
                const isRetryable = error?.status === 503 || error?.status === 429;
                if (!isRetryable || attempt === MAX_RETRIES) {
                    throw error;
                }
                const delayMs = 500 * Math.pow(2, attempt);
                console.warn(`Chatbot Gemini call failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delayMs}ms...`);
                await sleep(delayMs);
            }
        }
        throw lastError;
    }

    async clearHistory(userId: string) {
        await chatMessageRepository.deleteAllByUser(userId);
    }
}