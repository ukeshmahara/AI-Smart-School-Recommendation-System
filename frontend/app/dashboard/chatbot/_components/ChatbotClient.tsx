"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { toast } from "react-toastify";
import { Send, Trash2, Bot, User } from "lucide-react";
import { handleSendChatMessage, handleClearChat } from "@/lib/actions/chatbot-action";

interface ChatMessage {
    _id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export default function ChatbotClient({ initialMessages }: { initialMessages: ChatMessage[] }) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isPending, startTransition] = useTransition();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSend = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;

        const optimisticUserMessage: ChatMessage = {
            _id: `temp-${Date.now()}`,
            role: "user",
            content: trimmed,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticUserMessage]);
        setInput("");

        startTransition(async () => {
            const result = await handleSendChatMessage(trimmed);
            if (!result.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        _id: `temp-error-${Date.now()}`,
                        role: "assistant",
                        content: "Sorry, something went wrong sending that. Please try again.",
                        createdAt: new Date().toISOString(),
                    },
                ]);
                return;
            }
            setMessages((prev) => [...prev, result.data]);
        });
    };

    const onClear = async () => {
        const result = await handleClearChat();
        if (!result.success) {
            toast.error(result.message);
            return;
        }
        setMessages([]);
        toast.success("Chat cleared");
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700">
                        <Bot className="h-5 w-5 text-white" />
                    </span>
                    <p className="font-semibold text-gray-900">SikhshaSathi Assistant</p>
                </div>
                <button
                    onClick={onClear}
                    aria-label="Clear chat"
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <p className="py-10 text-center text-sm text-gray-400">
                        Say hello 👋 Ask me anything about schools, or just chat!
                    </p>
                ) : (
                    messages.map((m) => (
                        <div key={m._id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            {m.role === "assistant" && (
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50">
                                    <Bot className="h-4 w-4 text-blue-700" />
                                </span>
                            )}
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                                    m.role === "user"
                                        ? "rounded-br-sm bg-blue-700 text-white"
                                        : "rounded-bl-sm bg-gray-100 text-gray-800"
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{m.content}</p>
                            </div>
                            {m.role === "user" && (
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700">
                                    <User className="h-4 w-4 text-white" />
                                </span>
                            )}
                        </div>
                    ))
                )}
                {isPending && (
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50">
                            <Bot className="h-4 w-4 text-blue-700" />
                        </span>
                        <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2.5 text-sm text-gray-400">
                            Thinking, this can take a few seconds...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={onSend} className="flex items-center gap-2 border-t border-gray-100 p-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a question..."
                    className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                    type="submit"
                    disabled={isPending || !input.trim()}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}