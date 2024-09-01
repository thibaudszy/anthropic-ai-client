<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useChatStore } from "@/store/chat.ts";
import ChatItem from "./ChatItem.vue";

const chatStore = useChatStore();
</script>

<template>
    <div class="chat-container">
        <div v-if="chatStore.chat?.chat" class="response-container">
            <div
                v-for="(chatItem, index) in chatStore.chat.chat"
                :key="index"
                class="chat-item"
                :class="{
                    assistant: chatItem.role === 'assistant',
                    user: chatItem.role === 'user',
                }"
            >
                <ChatItem :chatItem="chatItem"></ChatItem>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    width: clamp(300px, 100%, 1500px);
    margin: 0;
    text-align: center;
    padding: 3rem;
    padding-top: 1rem;
    margin-bottom: 1rem;
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
    border-top: 1px solid #ddd;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

p {
    margin: 0;
    padding: 0;
}

.chat-item {
    width: 80%;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
}
.user {
    background-color: var(--color-background-soft);
    align-self: flex-end;
    width: 50%;
}
.assistant {
    background-color: var(--color-background-light);
}
</style>
