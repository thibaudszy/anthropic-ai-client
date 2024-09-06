<script setup lang="ts">
import Chat from "@/components/Chat.vue";
import PromptInput from "@/components/PromptInput.vue";
import { useClaudeChat } from "@/hooks/use-claude-chat";
import { unref } from "vue";

const claudeChat = useClaudeChat();

function onPrompt(prompt: string) {
    claudeChat.sendPrompt(prompt);
}
</script>

<template>
    <Chat
        :key="claudeChat.activeChat.value.id"
        class="chat-container"
        :chat-data="unref(claudeChat.activeChat)"
        :error="unref(claudeChat.error)"
        :is-streaming="unref(claudeChat.isLoading)"
        @retry="claudeChat.retryStream"
    />
    <PromptInput
        class="prompt-input"
        :stream-controller="unref(claudeChat.streamController)"
        :is-streaming="claudeChat.isLoading"
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
