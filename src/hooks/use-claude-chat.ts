import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Chat, ChatItem } from "../components/chat.types";
import Anthropic from "@anthropic-ai/sdk";
import { useChatHistory } from "@/stores/chat-history";
import { storeToRefs } from "pinia";
import { debounce } from "lodash-es";
import { MdToHtml } from "@/utils/md-to-html";

const debouncedSaveToLocalStorage = debounce((key: string, data: string) => {
    localStorage.setItem(key, data);
}, 500);

export function useClaudeChat() {
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

    const getDefaultChatValue = () => ({
        id: activeChatId.value,
        title: "New chat",
        chat: [],
    });
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
            activeChat.value = getDefaultChatValue();
        },
        { immediate: true },
    );

    const apiKey = localStorage.getItem("anthropic_api_key");
    const anthropic = new Anthropic({
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
        if (historyItem.title !== "New chat") {
            return;
        }
        const message = await anthropic.messages.create({
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: `Generate a title for this conversation. The title should provide context on the conversation and allow to easily find it later. The title should be maximum 6 words long. Your reply should only contain the title and nothing else. Conversation: ${JSON.stringify(activeChat.value?.chat)}`,
                },
            ],
            model: "claude-3-5-sonnet-20240620",
        });
        // @ts-expect-error -- text is part of the content
        historyItem.title = message.content[0].text;
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

    const sendPrompt = async (prompt: string) => {
        if (!prompt.trim()) {
            return;
        }

        const mdToHtml = new MdToHtml();

        if (!route.query.chatid) {
            chatHistoryStore.updateChatHistory(activeChat.value);
            router.replace({
                query: { ...route.query, chatid: activeChatId.value },
            });
        }

        activeChat.value.chat.push({
            role: "user",
            content: prompt,
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
        try {
            anthropic.messages
                .stream({
                    messages: activeChat.value.chat.map(
                        ({ role, content }) => ({
                            role,
                            content,
                        }),
                    ),
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 1024,
                })
                .on("text", async (text: string) => {
                    const lastChatItemIdx = activeChat.value.chat.length - 1;
                    const lastChatItem = activeChat.value.chat[lastChatItemIdx];
                    lastChatItem.content += text;
                    updateHtmlContent(
                        lastChatItem.content,
                        mdToHtml,
                        lastChatItem,
                    );
                })
                .on("end", () => {
                    generateTitleForChat();
                });
        } catch (error) {
            assistantResponse.content = "Error: Unable to fetch response";
        }
    };

    return { activeChat, sendPrompt, chatHistory };
}

function getChatStorageId(id: number) {
    return `chat-${id}`;
}
