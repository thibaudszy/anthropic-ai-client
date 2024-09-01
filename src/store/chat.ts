import {
    type ChatItem,
    type Chat,
    type ChatHistoryItem,
} from "@/components/chat.types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";

export const localStorageChatHistoryKey = "chat-history";

export const useChatStore = defineStore("chat", () => {
    const route = useRoute();
    const router = useRouter();

    const chatId = computed(() => {
        const { chatid } = route.query;
        if (typeof chatid === "number") return chatid;
        if (typeof chatid === "string" && !Number.isNaN(parseInt(chatid))) {
            return parseInt(chatid);
        }
        return null;
    });

    const initChat = () => {
        const id = chatId.value;
        if (id != null) {
            try {
                const storageValue = localStorage.getItem(id.toString());
                if (storageValue) {
                    return JSON.parse(storageValue);
                }
            } catch {}
        }
        return null;
    };

    const chat = ref<Chat | null>(initChat());

    const chatHistory = useStorage<ChatHistoryItem[]>(
        localStorageChatHistoryKey,
        [],
    );
    const prompt = ref<string>("");

    const sendPrompt = async () => {
        const promptToSend = prompt.value;
        prompt.value = "";

        if (!promptToSend.trim()) {
            return;
        }

        if (!chat.value?.chat) {
            chat.value = createChat();
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
        } finally {
            localStorage.setItem(
                getChatStorageId(chat.value.id.toString()),
                JSON.stringify(chat.value),
            );
        }
    };

    const generateNewChatId = () => {
        const newId = Date.now();
        chatHistory.value = chatHistory.value.concat({
            chatId: newId,
            title: "New chat",
        });

        router.replace({ query: { ...route.query, chatid: newId } });
        return newId;
    };
    const createChat: () => Chat = () => {
        return {
            id: generateNewChatId(),
            chat: new Array<ChatItem>(),
        };
    };

    return {
        chat,
        prompt,
        chatId,
        chatHistory,
        sendPrompt,
        generateNewChatId,
    };
});

function getChatStorageId(id: string) {
    return `chat-${id}`;
}
