<script setup lang="ts">
import Chat from "@/components/Chat.vue";
import PromptInput from "@/components/PromptInput.vue";
import { useChatStore } from "@/store/chat.ts";
import { useClaudeChat } from "@/hooks/use-claude-chat.ts";

const chatStore = useChatStore();
const claudeChat = useClaudeChat();

function onPrompt(prompt: string) {
    claudeChat.sendPrompt(prompt);
}
</script>

<template>
    <h1>Chat with Claude</h1>
    <Chat class="chat-container" :chat-data="claudeChat.activeChat" />
    <PromptInput class="prompt-input" @send-prompt="onPrompt" />
</template>

<style scoped>
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
