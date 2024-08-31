import type { ChatItem } from "@/components/chat.types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
    const chat = ref<ChatItem[]>(
        JSON.parse(localStorage.getItem("chat")) || [],
    );
    const prompt = ref<string>("");

    const sendPrompt = async () => {
        const promptToSend = prompt.value;
        prompt.value = "";

        if (!promptToSend.trim()) {
            return;
        }

        chat.value.push({ role: "user", content: promptToSend });
        const AssistantResponse: ChatItem = {
            role: "assistant",
            content: "",
        };
        chat.value.push(AssistantResponse);
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
                    chat.value[chat.value.length - 1].content += chunk;
                }
            }
        } catch (error) {
            AssistantResponse.content = "Error: Unable to fetch response";
        } finally {
            localStorage.setItem("chat", JSON.stringify(chat.value));
        }
    };
    const resetChat = () => {
        chat.value = [];
    };
    return { chat, prompt, sendPrompt, resetChat };
});
