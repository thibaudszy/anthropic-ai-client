import {
    type ChatItem,
    type Chat,
    type ChatHistoryItem,
} from "@/components/chat.types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export const useChatStore = defineStore("chat", () => {
    const route = useRoute();

    const chatId = computed(() => {
        return route.query.chatid;
    });

    const chat = computed<Chat>(() => {
        const defaultChat = {
            id: Date.now().toString(),
            chat: [],
        };
        if (!chatId.value) {
            return defaultChat;
        }
        try {
            return (
                JSON.parse(localStorage.getItem(chatId.value)) || defaultChat
            );
        } catch {
            return defaultChat;
        }
    });

    const chatHistory = ref<ChatHistoryItem[]>([]);
    const prompt = ref<string>("");

    const sendPrompt = async () => {
        const promptToSend = prompt.value;
        prompt.value = "";

        if (!promptToSend.trim()) {
            return;
        }

        chat.value.chat.push({ role: "user", content: promptToSend });
        const AssistantResponse: ChatItem = {
            role: "assistant",
            content: "",
        };
        chat.value.chat.push(AssistantResponse);
        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(chat.value.chat),
            });

            if (!response.body) {
                AssistantResponse.content =
                    "There was an error getting the response from the assistant";
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    console.log({ chunk });
                    chat.value.chat[chat.value.chat.length - 1].content +=
                        chunk;
                }
            }
        } catch (error) {
            AssistantResponse.content = "Error: Unable to fetch response";
            console.log(error);
        } finally {
            localStorage.setItem(
                getChatStorageId(chat.value.id),
                JSON.stringify(chat.value),
            );
        }
    };
    const resetChat = () => {
        chat.value.chat = [];
    };
    return { chat, prompt, chatId, chatHistory, sendPrompt, resetChat };
});

function getChatStorageId(id: string) {
    return `chat-${id}`;
}
