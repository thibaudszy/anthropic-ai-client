import type { Chat, ChatHistoryItem } from "@/components/chat.types";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

export const useChatHistory = defineStore("chat-history", () => {
    const localStorageChatHistoryKey = "chat-history";
    const chatHistory = useLocalStorage<ChatHistoryItem[]>(
        localStorageChatHistoryKey,
        [],
    );
    console.log({ chatHistory: chatHistory.value });
    const updateChatHistory = (activeChat: Chat) => {
        if (chatHistory.value.some(({ chatId }) => chatId === activeChat.id)) {
            return;
        }
        chatHistory.value.unshift({
            chatId: activeChat.id,
            title: activeChat.title,
        });
    };

    return { chatHistory, updateChatHistory };
});
