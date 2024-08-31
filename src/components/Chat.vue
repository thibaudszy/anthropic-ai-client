<template>
    <div class="chat-container">
        <h1>Chat with Claude</h1>
        <input
            v-model="prompt"
            @keyup.enter="sendPrompt"
            placeholder="Type your message and press Enter"
            class="prompt-input"
        />
        <button @click="sendPrompt" class="send-button">Send</button>
        <div class="response-container">
            <p v-for="(line, index) in responseLines" :key="index">
                {{ line }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const prompt = ref("");
const responseLines = ref<string[]>([]);

const sendPrompt = async () => {
    if (!prompt.value.trim()) {
        return;
    }

    responseLines.value = []; // Clear previous responses

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt.value }),
        });

        responseLines.push("");
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader?.read();
            console.log({ value, doneReading });
            done = doneReading;

            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                responseLines.value[responseLines.value.length - 1] += chunk;
                console.log({ rl: responseLines.value });
            }
        }
        console.log("DONE");
    } catch (error) {
        responseLines.value.push("Error: Unable to fetch response");
    } finally {
        prompt.value = ""; // Clear the input after sending
    }
};
</script>

<style scoped>
.chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

.prompt-input {
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 16px;
}

.send-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.response-container {
    margin-top: 20px;
    text-align: left;
    white-space: pre-wrap; /* Preserves whitespace for streaming text */
    border-top: 1px solid #ddd;
    padding-top: 10px;
}

p {
    margin: 0;
    padding: 0;
}
</style>
