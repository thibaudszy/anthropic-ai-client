<script setup lang="ts">
import { computed, ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";

type Emits = {
    "send-prompt": string;
};
const emit = defineEmits<Emits>();
const { textarea, input } = useTextareaAutosize();

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
    emit("send-prompt", input.value);
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
        <button type="submit" @click.prevent="handleSubmit">Send</button>
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
    width: clamp(10rem, 40dvw, 40rem);
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
}
</style>
