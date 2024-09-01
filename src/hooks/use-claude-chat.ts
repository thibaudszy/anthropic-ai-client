import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Chat, ChatItem } from "../components/chat.types.ts";
import Anthropic from "@anthropic-ai/sdk";

export function useClaudeChat() {
    const route = useRoute();
    const router = useRouter();

    const activeChatId = computed(() => {
        const newId = Date.now();
        const { chatid } = route.query;
        if (typeof chatid === "string") {
            const num = parseInt(chatid);
            return Number.isNaN(num) ? newId : num;
        }
        if (typeof chatid === "number") {
            return chatid;
        }
        return newId;
    });

    const activeChat = useLocalStorage<Chat>(
        getChatStorageId(activeChatId.value),
        { id: activeChatId.value, title: "New Chat", chat: [] },
    );

    const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const sendPrompt = async (prompt: string) => {
        if (!prompt.trim()) {
            return;
        }

        if (!route.query.chatid) {
            router.replace({
                query: { ...route.query, chatid: activeChatId.value },
            });
        }

        activeChat.value.chat.push({ role: "user", content: prompt });
        const assistantResponse: ChatItem = {
            role: "assistant",
            content: "",
        };
        activeChat.value.chat.push(assistantResponse);
        try {
            const response = anthropic.messages
                .stream({
                    messages: activeChat.value.chat,
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 1024,
                })
                .on("text", (text: string) => {
                    console.log("LOG:", text);
                    activeChat.value.chat[
                        activeChat.value.chat.length - 1
                    ].content += text;
                })
                .on("end", () => {
                    // generateTitleForChat();
                });
        } catch (error) {
            assistantResponse.content = "Error: Unable to fetch response";
        }
    };

    return { activeChat, sendPrompt };
}

function getChatStorageId(id: number) {
    return `chat-${id}`;
}
