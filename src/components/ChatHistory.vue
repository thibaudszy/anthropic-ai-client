<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useChatHistory } from "@/stores/chat-history";
import { storeToRefs } from "pinia";
import type { ChatHistoryItem } from "./chat.types";

const route = useRoute();
const router = useRouter();

const chatHistoryStore = useChatHistory();
const { chatHistory } = storeToRefs(chatHistoryStore);

function deleteHistoryItem(historyItemToDelete: ChatHistoryItem) {
    chatHistoryStore.chatHistory = chatHistoryStore.chatHistory.filter((el) => {
        return el.chatId !== historyItemToDelete.chatId;
    });
    if (route.query.chatid === historyItemToDelete.chatId) {
        const newQuery = { ...route.query };
        delete newQuery.chatid;
        router.replace({ query: newQuery });
    }
    localStorage.removeItem(historyItemToDelete.chatId);
}
</script>

<template>
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
            <div class="delete" title="delete chat">
                <button
                    class="icon delete-button"
                    @click="deleteHistoryItem(item)"
                >
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
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                        />
                    </svg>
                </button>
            </div>
        </li>
    </ul>
</template>

<style scoped>
ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;

    & li {
        width: 100%;
        text-align: left;
        position: relative;
        border-bottom: 2px solid white;

        & a {
            display: block;
            padding-block: 0.5rem;
            padding-inline: 1rem;
            @media (max-width: 800px) {
                padding-block: 1rem;
                margin-right: 3rem;
            }
        }

        & .delete {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-inline: 0.5rem;
            @media (max-width: 800px) {
                padding-inline: 1rem;
            }

            & button.icon {
                visibility: visible;
            }
            @media (min-width: 800px) {
                & button.icon:not(:focus) {
                    --invisible-btn-diameter: 0px;
                    max-height: var(--invisible-btn-diameter);
                    max-width: var(--invisible-btn-diameter);
                    min-width: var(--invisible-btn-diameter);
                    min-height: var(--invisible-btn-diameter);
                }
            }
        }

        &:hover {
            background-color: gray;
            & .delete {
                & button.icon {
                    visibility: visible;
                    pointer-events: auto;
                    max-height: var(--icon-btn-diameter);
                    max-width: var(--icon-btn-diameter);
                    min-width: var(--icon-btn-diameter);
                    min-height: var(--icon-btn-diameter);
                }
            }
        }
    }
}
</style>
