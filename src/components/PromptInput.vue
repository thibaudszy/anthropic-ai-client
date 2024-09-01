<script setup lang="ts">
import { useChatStore } from "../store/chat.ts";
import { computed, ref } from "vue";

type Emits = {
    "send-prompt": string;
};
const emit = defineEmits<Emits>();

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
const promptInitialValue = "";
const prompt = ref<string>(promptInitialValue);
function handleSubmit() {
    emit("send-prompt", prompt.value);
    prompt.value = promptInitialValue;
}
</script>

<template>
    <form @keydown="submitFormOnCommandEnter">
        <textarea v-model="prompt" :rows="textAreaRows"> </textarea>
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
    padding-inline: 1rem;
    padding-block: 0.5rem;
}
</style>
