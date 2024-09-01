<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useChatHistory } from "@/stores/chat-history.ts";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();

const chatHistoryStore = useChatHistory();
const { chatHistory } = storeToRefs(chatHistoryStore);
</script>

<template>
    <aside>
        <header>
            <h2>Chat history</h2>

            <router-link
                title="New chat"
                :to="{
                    path: '/',
                }"
            >
                <button class="new-chat icon">
                    <svg
                        class="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 12h14m-7 7V5"
                        />
                    </svg>
                </button>
            </router-link>
        </header>
        <ul>
            <li v-for="item in chatHistory" :key="item.chatId">
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
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 0.5rem;
    padding-top: 0.5rem;
}
aside {
    overflow: auto;
    border-right: 2px solid var(--ghost-white);

    & ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        width: 100%;

        & li {
            width: 100%;
            text-align: left;

            border-bottom: 2px solid white;

            & a {
                display: block;
                padding-block: 0.5rem;
                padding-inline: 1rem;
            }

            &:hover {
                background-color: gray;
            }
        }
    }
}
.new-chat {
    & a {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
