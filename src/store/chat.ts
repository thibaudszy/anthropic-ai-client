import {
    type ChatItem,
    type Chat,
    type ChatHistoryItem,
} from "@/components/chat.types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";
import Anthropic from "@anthropic-ai/sdk";
import { debounce } from "lodash-es";

export const localStorageChatHistoryKey = "chat-history";

const debouncedSaveChatToLocalStorage = debounce(saveChatToLocalStorage, 300);

export const useChatStore = defineStore("chat", () => {
    const router = useRouter();
    const anthropic = new Anthropic({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    const chatId = ref<number | null>();

    const initChat = (newChatId: number) => {
        debugger;
        const id = newChatId;
        if (id != null) {
            try {
                const storageValue = localStorage.getItem(
                    getChatStorageId(newChatId),
                );
                if (storageValue) {
                    return JSON.parse(storageValue);
                }
            } catch {}
        }
        return null;
    };

    const chat = ref<Chat | null>(null);

    const updateChatId = (newChatId: number) => {
        chatId.value = newChatId;
        chat.value = initChat(newChatId);
    };

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

        if (!chatId.value) {
            chat.value = createChat();
        }

        chat.value.chat.push({ role: "user", content: promptToSend });
        const assistantResponse: ChatItem = {
            role: "assistant",
            content: "",
        };
        chat.value.chat.push(assistantResponse);
        try {
            const response = anthropic.messages
                .stream({
                    messages: chat.value.chat,
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 1024,
                })
                .on("text", (text: string) => {
                    console.log("LOG:", text);
                    chat.value.chat[chat.value.chat.length - 1].content += text;
                })
                .on("end", () => {
                    debugger;
                    debouncedSaveChatToLocalStorage(chat.value);
                    // generateTitleForChat();
                });
        } catch (error) {
            assistantResponse.content = "Error: Unable to fetch response";
        }
    };

    const generateNewChatId = () => {
        const newId = Date.now();
        chatHistory.value = chatHistory.value.concat({
            chatId: newId,
            title: "New chat",
        });
        const route = useRoute();
        router.replace({ query: { chatid: newId } });
        return newId;
    };

    const createChat: () => Chat = () => {
        return {
            id: generateNewChatId(),
            chat: new Array<ChatItem>(),
        };
    };

    const generateTitleForChat = async () => {
        const historyItem = chatHistory.value.find(
            (el) => el.chatId === parseInt(chatId.value),
        );
        debugger;
        if (!historyItem) {
            console.error(
                "something went wrong. There should be an history item",
            );
            return;
        }
        if (historyItem.title !== "New chat") {
            return;
        }
        const message = await anthropic.messages.create({
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `Generate a title for this conversation. The title should be maximum 6 words long. Your reply should only contain the title and nothing else. Conversation: ${JSON.stringify(chat.value?.chat)}`,
                },
            ],
            model: "claude-3-opus-20240229",
        });
        console.log("content", message.content);
        historyItem.title = message.content;
    };

    return {
        chat,
        prompt,
        chatId,
        chatHistory,
        sendPrompt,
        updateChatId,
        generateNewChatId,
    };
});

function getChatStorageId(id: number | string) {
    return `chat-${id}`;
}
function saveChatToLocalStorage(chat: Chat) {
    localStorage.setItem(getChatStorageId(chat.id), JSON.stringify(chat));
}
