import { defineStore } from "pinia";
import { ref } from "vue";

interface ChatHistoryItem {
    role: "user" | "assistant";
    content: string;
}

export const useChatStore = defineStore("chat", () => {
    const chat = ref<ChatHistoryItem[]>([]);
    const prompt = ref<string>("");

    return { chat, prompt };
});
