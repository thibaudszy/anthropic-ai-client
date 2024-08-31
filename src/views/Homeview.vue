<script setup lang="ts">
import Chat from "@/components/Chat.vue";
import PromptInput from "@/components/PromptInput.vue";
import { useChatStore } from "@/store/chat.ts";

const chatStore = useChatStore();
</script>

<template>
    <h1>Chat with Claude</h1>
    <Chat class="chat-container" />
    <PromptInput class="prompt-input" />
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
