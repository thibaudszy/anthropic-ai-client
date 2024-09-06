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
    <header>
        <h1>Claude 3.5 Sonnet</h1>
    </header>
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
header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    position: relative;
    box-shadow:
        0 4px 6px -1px rgba(255, 255, 255, 0.1),
        0 2px 4px -1px rgba(255, 255, 255, 0.06);
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
