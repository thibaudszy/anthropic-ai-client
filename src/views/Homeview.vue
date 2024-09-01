<script setup lang="ts">
import Chat from "@/components/Chat.vue";
import PromptInput from "@/components/PromptInput.vue";
import { useClaudeChat } from "@/hooks/use-claude-chat.ts";

const claudeChat = useClaudeChat();

function onPrompt(prompt: string) {
    claudeChat.sendPrompt(prompt);
}
</script>

<template>
    <header>
        <h1>Claude 3.5 Sonnet</h1>
    </header>
    <Chat class="chat-container" :chat-data="claudeChat.activeChat" />
    <PromptInput class="prompt-input" @send-prompt="onPrompt" />
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
    text-align: center;
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
