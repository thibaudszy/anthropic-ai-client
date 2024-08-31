<script setup lang="ts">
import Chat from "./components/Chat.vue";
import PromptInput from "./components/PromptInput.vue";
import { useChatStore } from "@/store/chat.ts";

const chatStore = useChatStore();
</script>

<template>
    <div class="app-content">
        <main class="main-content">
            <h1>Chat with Claude</h1>
            <Chat class="chat-container" />
            <button class="reset-chat-btn" @click="chatStore.resetChat">
                Reset
            </button>
            <PromptInput class="prompt-input" />
        </main>
    </div>
</template>

<style scoped>
.app-content {
    max-height: 100dvh;
    width: 100%;
    display: flex;
    overflow: hidden;
}
.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
}
.chat-container {
    flex-grow: 1;
    overflow: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
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
