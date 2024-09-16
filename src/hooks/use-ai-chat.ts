import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Chat, ChatItem } from "../components/chat.types";
import OpenAI from "openai";
import { useChatHistory } from "@/stores/chat-history";
import { storeToRefs } from "pinia";
import { debounce } from "lodash-es";
import { MdToHtml } from "@/utils/md-to-html";
import { defaultPreset, hidePreset } from "./preset";
import { models } from "@/models";

const debouncedSaveToLocalStorage = debounce((key: string, data: string) => {
    localStorage.setItem(key, data);
}, 500);

export function useAiChat() {
    const route = useRoute();
    const router = useRouter();

    const activeChatId = computed(() => {
        const newId = getChatStorageId(Date.now());
        const { chatid } = route.query;
        if (typeof chatid === "string") {
            return chatid;
        }
        return newId;
    });

    const getDefaultChatValue = () =>
        ({
            id: activeChatId.value,
            title: "New chat",
            chat: [],
        }) as Chat;
    const activeChat = ref<Chat>(getDefaultChatValue());

    watch(
        activeChatId,
        (newValue) => {
            try {
                const storedValue = localStorage.getItem(newValue);
                if (storedValue) {
                    activeChat.value = JSON.parse(storedValue);
                    return;
                }
            } catch {}
            const newQuery = { ...route.query };
            delete newQuery.chatid;
            router.replace({ query: newQuery });
            activeChat.value = getDefaultChatValue();
        },
        { immediate: true },
    );

    const apiKey = localStorage.getItem("openai_api_key") || undefined;
    const aiClient = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
    });

    const chatHistoryStore = useChatHistory();
    const { chatHistory } = storeToRefs(chatHistoryStore);

    const generateTitleForChat = async () => {
        const historyItemIndex = chatHistory.value.findIndex(
            (el) => el.chatId === activeChatId.value,
        );
        const historyItem = chatHistory.value[historyItemIndex];
        if (!historyItem) {
            console.error(
                "something went wrong. There should be an history item",
            );
            return;
        }

        const message = await aiClient.chat.completions.create({
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `Generate a title for this conversation. The title should provide context on the conversation and allow to easily find it later. The title should be maximum 6 words long. Your reply should only contain the title and nothing else. Conversation: ${JSON.stringify(activeChat.value?.chat)}`,
                },
            ],
            model: "gpt-4o-mini",
        });

        historyItem.title = message.choices[0].message.content || "New Chat";
    };

    const updateHtmlContent = async (
        mdContent: string,
        mdToHtml: MdToHtml,
        chatItem: ChatItem,
    ) => {
        chatItem.htmlContent = await mdToHtml.transpile(mdContent);
        debouncedSaveToLocalStorage(
            activeChatId.value,
            JSON.stringify(activeChat.value),
        );
    };

    const retryStream = async () => {
        await getResponseForActiveChat(new MdToHtml());
    };

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const sendPrompt = async (prompt: string) => {
        isLoading.value = true;
        error.value = null;
        if (!prompt?.trim()) {
            return;
        }

        const mdToHtml = new MdToHtml();

        if (!route.query.chatid) {
            chatHistoryStore.updateChatHistory(activeChat.value);
            router.replace({
                query: { ...route.query, chatid: activeChatId.value },
            });
        }

        const baseInstructions = !activeChat.value.chat.length
            ? hidePreset(defaultPreset) + "\n"
            : "";
        activeChat.value.chat.push({
            role: "user",
            content: baseInstructions + prompt,
            htmlContent: prompt,
            id: Date.now(),
        });
        updateHtmlContent(
            prompt,
            mdToHtml,
            activeChat.value.chat[activeChat.value.chat.length - 1],
        );
        const assistantResponse: ChatItem = {
            role: "assistant",
            content: "",
            htmlContent: "",
            id: Date.now(),
        };
        activeChat.value.chat.push(assistantResponse);
        await getResponseForActiveChat(mdToHtml);
    };

    const streamController = ref<AbortController | null>(null);
    const getResponseForActiveChat = async (mdToHtml: MdToHtml) => {
        // Use cheaper model for testing
        const model = (route.query.model || models[0]) as string;
        try {
            const stream = await aiClient.chat.completions.create({
                messages: activeChat.value.chat.map(({ role, content }) => ({
                    role,
                    content,
                })),
                model: model,
                max_tokens: 1024,
                stream: true,
            });
            streamController.value = stream.controller;

            for await (const messageStreamEvent of stream) {
                const text =
                    messageStreamEvent.choices[0]?.delta?.content || "";
                if (text) {
                    const lastChatItemIdx = activeChat.value.chat.length - 1;
                    const lastChatItem = activeChat.value.chat[lastChatItemIdx];
                    lastChatItem.content += text;
                    updateHtmlContent(
                        lastChatItem.content,
                        mdToHtml,
                        lastChatItem,
                    );
                }
            }
            streamController.value = null;
            await generateTitleForChat();
        } catch (err) {
            if (err instanceof Error) {
                error.value = err?.message;
            } else {
                error.value = "A weird error occurred";
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        activeChat,
        error,
        isLoading,
        sendPrompt,
        retryStream,
        streamController,
    };
}

function getChatStorageId(id: number) {
    return `chat-${id}`;
}
