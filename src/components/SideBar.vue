<script setup lang="ts">
import { useChatStore } from "@/store/chat.ts";

const chatStore = useChatStore();
</script>

<template>
    <aside>
        <h2>Chat history</h2>
        <ul>
            <li v-for="item in chatStore.chatHistory" :key="item.chatId">
                <button>{{ item.title }}</button>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
aside {
    --sidebar-width: 15rem;
    min-width: var(--sidebar-width);
    max-width: var(--sidebar-width);
    overflow: auto;

    & ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        row-gap: 0.1rem;
        width: 100%;

        & button {
            width: 100%;
            text-align: left;
            padding-block: 0.5rem;
            padding-inline: 1rem;
        }
    }
}
</style>
