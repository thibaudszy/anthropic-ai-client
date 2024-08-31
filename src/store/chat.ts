import type { ChatItem } from "@/components/chat.types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
    const chat = ref<ChatItem[]>([
        {
            role: "user",
            content: "hello",
        },
        {
            role: "assistant",
            content:
                "Hello! How can I assist you today? Feel free to ask me any questions or let me know if you need help with anything.",
        },
        {
            role: "user",
            content: "give me a boilerplate vue3 component in TS",
        },
        {
            role: "assistant",
            content:
                'Certainly! Here\'s a boilerplate Vue 3 component using TypeScript:\n\n```typescript\n<template>\n  <div class="my-component">\n    <h1>{{ title }}</h1>\n    <p>{{ message }}</p>\n    <button @click="incrementCount">Clicked {{ count }} times</button>\n  </div>\n</template>\n\n<script lang="ts">\nimport { defineComponent, ref } from \'vue\'\n\nexport default defineComponent({\n  name: \'MyComponent\',\n  props: {\n    title: {\n      type: String,\n      required: true\n    },\n    message: {\n      type: String,\n      default: \'This is a default message\'\n    }\n  },\n  setup() {\n    const count = ref(0)\n\n    const incrementCount = () => {\n      count.value++\n    }\n\n    return {\n      count,\n      incrementCount\n    }\n  }\n})\n</script>\n\n<style scoped>\n.my-component {\n  padding: 20px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n</style>\n```\n\nThis boilerplate includes:\n\n1. A template section with some basic HTML structure.\n2. A script section using TypeScript, which:\n   - Imports necessary functions from Vue.\n   - Uses `defineComponent` for better TypeScript inference.\n   - Defines props with types.\n   - Uses the Composition API with the `setup` function.\n   - Includes a reactive `ref` and a method.\n3. A scoped style section for component-specific CSS.\n\nYou can use this component in a parent component like this:\n\n```vue\n<template>\n  <MyComponent title="Hello, Vue 3!" message="This is a custom message" />\n</template>\n\n<script lang="ts">\nimport { defineComponent } from \'vue\'\nimport MyComponent from \'./MyComponent.vue\'\n\nexport default defineComponent({\n  components: {\n    MyComponent\n  }\n})\n</script>\n```\n\nRemember to adjust the import path for `MyComponent` based on your project structure.',
        },
        {
            role: "user",
            content: "thank you",
        },
        {
            role: "assistant",
            content: "",
        },
    ]);
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
            prompt.value = ""; // Clear the input after sending
        }
    };

    return { chat, prompt, sendPrompt };
});
