import {
    type ChatItem,
    type Chat,
    type ChatHistoryItem,
} from "@/components/chat.types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";

export const useChatStore = defineStore("chat", () => {
    const route = useRoute();

    const routeChatId = route.query.chatId;
    const chatId =
        typeof routeChatId === "string" ? getChatStorageId(routeChatId) : null;

    const chat = ref<Chat>(
        chatId
            ? JSON.parse(localStorage.getItem(chatId))
            : {
                  id: Date.now().toString(),
                  chat: [],
              },
    );

    const chatHistory = ref<ChatHistoryItem[]>([
        { title: "Discussing AI Trends", chatId: "chat001" },
        { title: "Project Brainstorming", chatId: "chat002" },
        { title: "Weekly Team Meeting", chatId: "chat003" },
        { title: "Marketing Strategy", chatId: "chat004" },
        { title: "Customer Support Inquiry", chatId: "chat005" },
        { title: "Technical Troubleshooting", chatId: "chat006" },
        { title: "Onboarding New Employees", chatId: "chat007" },
        { title: "Product Feedback Session", chatId: "chat008" },
        { title: "Budget Planning", chatId: "chat009" },
        { title: "Design Review", chatId: "chat010" },
        { title: "Quarterly Goals", chatId: "chat011" },
        { title: "Sales Pitch Practice", chatId: "chat012" },
        { title: "Partnership Discussions", chatId: "chat013" },
        { title: "App Feature Requests", chatId: "chat014" },
        { title: "Market Research Analysis", chatId: "chat015" },
        { title: "Code Review Session", chatId: "chat016" },
        { title: "User Experience Feedback", chatId: "chat017" },
        { title: "AI Ethics Debate", chatId: "chat018" },
        { title: "Development Roadmap", chatId: "chat019" },
        { title: "Client Onboarding", chatId: "chat020" },
    ]);
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
                body: JSON.stringify(chat.value),
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
                    chat.value.chat[chat.value.chat.length - 1].content +=
                        chunk;
                }
            }
        } catch (error) {
            AssistantResponse.content = "Error: Unable to fetch response";
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
    return { chat, prompt, chatHistory, sendPrompt, resetChat };
});

function getChatStorageId(id: string) {
    return `chat-${id}`;
}
