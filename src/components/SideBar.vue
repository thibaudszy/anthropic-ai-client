<script setup lang="ts">
import { useChatStore } from "@/store/chat.ts";
import { useRoute, useRouter } from "vue-router";

const chatStore = useChatStore();

const router = useRouter();
const route = useRoute();
</script>

<template>
    <aside>
        <h2>Chat history</h2>
        <button>
            <router-link
                :to="{
                    query: { path: '/' },
                }"
            >
                New Chat
            </router-link>
        </button>
        <ul>
            <li v-for="item in chatStore.chatHistory" :key="item.chatId">
                <RouterLink
                    :to="{
                        path: '/',
                        query: { ...route.query, chatid: item.chatId },
                    }"
                >
                    {{ item.title }}
                </RouterLink>
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
