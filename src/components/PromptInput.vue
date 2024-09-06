<script setup lang="ts">
import { useTextareaAutosize } from "@vueuse/core";
import { computed, onMounted, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

type Emits = {
    (e: "send-prompt", value: string): void;
};
const emit = defineEmits<Emits>();

type Props = {
    isStreaming: Ref<boolean>;
    streamController: AbortController | null;
};
const props = defineProps<Props>();

const { textarea, input } = useTextareaAutosize();

onMounted(() => {
    textarea.value.focus();
});
const route = useRoute();
const activeChatId = computed(() => {
    const { chatid } = route.query;
    return chatid;
});

watch(activeChatId, (newValue) => {
    if (!newValue) {
        textarea.value.focus();
    }
});
const promptInitialValue = "";

function submitFormOnCommandEnter(keyPressEvent: KeyboardEvent) {
    if (
        (keyPressEvent.metaKey || keyPressEvent.ctrlKey) &&
        keyPressEvent.key === "Enter"
    ) {
        keyPressEvent.preventDefault();
        handleSubmit();
    }
}

function handleSubmit() {
    if (props.isStreaming.value) {
        return;
    }
    emit("send-prompt", input.value as string);
    input.value = promptInitialValue;
}
</script>

<template>
    <form @keydown="submitFormOnCommandEnter">
        <textarea
            ref="textarea"
            class="resize-none"
            v-model="input"
            placeholder="Proomt goes here"
        >
        </textarea>
        <button
            v-if="streamController"
            class="icon"
            type="button"
            title="Abort"
            @click="streamController?.abort()"
        >
            <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M7 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Z"
                />
            </svg>
        </button>
        <button
            v-else
            type="submit"
            :disabled="isStreaming.value"
            @click.prevent="handleSubmit"
        >
            Send
        </button>
    </form>
</template>

<style scoped>
form {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    column-gap: 10px;
    background-color: hsl(0deg 0% 18.43%);
    padding: 0.5rem 1rem;
    width: max-content;
    margin-bottom: 10px;
    border-radius: 1rem;

    & button[type="submit"] {
        align-self: flex-end;
    }
}

textarea {
    resize: none;
    width: clamp(15rem, 40dvw, 40rem);
    color: var(--ghost-white);
    padding-block: 0.5rem;
    background-color: transparent;
    border: none;
    max-height: clamp(4rem, 20dvh, 20dvh);
    scrollbar-color: var(--ghost-white) hsl(0deg 0% 18.43%);
    &:focus {
        outline: none;
        box-shadow: none;
        border-color: inherit;
    }
    @media (max-width: 800px) {
        font-size: large;
    }
}
</style>
