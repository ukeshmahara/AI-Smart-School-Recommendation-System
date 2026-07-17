import { handleGetChatHistory } from "@/lib/actions/chatbot-action";
import ChatbotClient from "./_components/ChatbotClient";

export default async function ChatbotPage() {
    const result = await handleGetChatHistory();

    return (
        <main className="mx-auto max-w-3xl px-6 py-8">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Chatbot</h1>
            <ChatbotClient initialMessages={result.data} />
        </main>
    );
}