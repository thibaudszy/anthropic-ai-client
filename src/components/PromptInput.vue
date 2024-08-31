<script setup lang="ts">
import { useChatStore } from "../store/chat.ts";
import { computed } from "vue";

const chatStore = useChatStore();
const textAreaRows = computed(() => {
    return Math.min(chatStore.prompt.split("\n").length, 10);
});

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
    chatStore.sendPrompt();
}
</script>

<template>
    <form @keydown="submitFormOnCommandEnter">
        <textarea v-model="chatStore.prompt" :rows="textAreaRows"> </textarea>
        <button type="submit" @click.prevent="handleSubmit">Send</button>
    </form>
</template>

<style scoped>
form {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 5px;
    column-gap: 10px;
}
textarea {
    resize: none;
    min-width: 10rem;
    width: 100%;
    max-width: 30rem;
    background-color: gray;
    color: antiquewhite;
}
</style>
