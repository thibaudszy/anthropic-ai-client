<script setup lang="ts">
import Chat from "@/components/Chat.vue";
import PromptInput from "@/components/PromptInput.vue";
import { useAiChat } from "@/hooks/use-ai-chat";
import { unref } from "vue";

const aiChat = useAiChat();

function onPrompt(prompt: string) {
    aiChat.sendPrompt(prompt);
}
</script>

<template>
    <Chat
        :key="aiChat.activeChat.value.id"
        class="chat-container"
        :chat-data="unref(aiChat.activeChat)"
        :error="unref(aiChat.error)"
        :is-streaming="unref(aiChat.isLoading)"
        @retry="aiChat.retryStream"
    />
    <PromptInput
        class="prompt-input"
        :stream-controller="unref(aiChat.streamController)"
        :is-streaming="aiChat.isLoading"
        @send-prompt="onPrompt"
    />
</template>

<style scoped>
h1 {
    font-size: 20px;
}
.chat-container {
    flex-grow: 1;
    overflow: auto;
}

.reset-chat-btn {
    border-radius: 50%;
    height: clamp(4rem, 4rem, 4rem);
    width: clamp(4rem, 4rem, 4rem);
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}
</style>
