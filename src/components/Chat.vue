<script setup lang="ts">
import ChatItem from "./ChatItem.vue";
import type { Chat } from "@/components/chat.types";
import { computed, onMounted, ref, watch } from "vue";
import { vIntersectionObserver } from "@vueuse/components";
import { debounce } from "lodash-es";

type Props = {
    chatData: Chat;
    error: string | null;
    isStreaming: boolean;
};
const props = defineProps<Props>();

type Emits = {
    (e: "retry"): void;
};
const bottomOfChat = ref<HTMLElement | null>();
const autoScroll = ref<boolean>(true);

async function onIntersectionObserver([
    { isIntersecting },
]: IntersectionObserverEntry[]) {
    autoScroll.value = isIntersecting;
}

const scrollToBottom = debounce(() => {
    bottomOfChat.value?.scrollIntoView({ behavior: "auto" });
}, 50);

onMounted(() => {
    scrollToBottom();
});

watch(props.chatData, (newValue, oldValue) => {
    if (newValue.chat.length > oldValue.chat.length) {
        scrollToBottom();
    }

    if (autoScroll.value) {
        scrollToBottom();
    }
});

const emit = defineEmits<Emits>();
const lastChatRole = computed(() => {
    return props.chatData.chat?.at(-1)?.role;
});
</script>

<template>
    <div class="chat-container">
        <div class="response-container">
            <div
                v-for="chatItem in chatData.chat"
                :key="chatItem.id"
                class="chat-item"
                :class="{
                    assistant: chatItem.role === 'assistant',
                    user: chatItem.role === 'user',
                    hidden: chatItem.hidden,
                }"
            >
                <ChatItem :chatItem="chatItem"></ChatItem>
            </div>
            <div v-if="error" role="alert" aria-polite="assertive">
                <div>
                    <h4>Error</h4>
                    <p>
                        {{ error }}
                    </p>
                </div>
                <button
                    v-if="lastChatRole === 'user'"
                    type="button"
                    :disabled="isStreaming"
                    @click="$emit('retry')"
                >
                    Retry
                </button>
            </div>
        </div>
        <div class="bottom-relative-container" ref="bottomOfChat">
            <div
                v-intersection-observer="onIntersectionObserver"
                class="bottom-anchor"
            ></div>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    margin: 0;
    text-align: center;
    padding: 1rem 3rem;
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.response-container {
    margin-top: 20px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
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

p {
    margin: 0;
    padding: 0;
}

.chat-item {
    max-width: 80%;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
}
.user {
    background-color: var(--color-background-soft);
    align-self: flex-end;
    width: 70%;
}
.assistant {
    background-color: transparent;
    max-width: 90%;
}
.hidden {
    visibility: hidden;
}
div[role="alert"] {
    color: red;
    border: 2px solid red;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--light-night);
    display: flex;
    justify-content: space-between;
    align-items: center;
    & h4 {
        font-weight: bold;
    }
    & button {
        width: fit-content;
    }
}
.bottom-relative-container {
    position: relative;
}

.bottom-anchor {
    height: 10px;
    position: absolute;
    bottom: 0;
    pointer-events: none;
    width: 50%;
}
</style>
