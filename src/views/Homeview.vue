<script setup lang="ts">
import Chat from "@/components/Chat.vue";
import PromptInput from "@/components/PromptInput.vue";
import { useClaudeChat } from "@/hooks/use-claude-chat";
import { ref } from "vue";

const claudeChat = useClaudeChat();

function onPrompt(prompt: string) {
    claudeChat.sendPrompt(prompt);
}
const showApiKeyRequest = ref(false);
if (!localStorage.getItem("anthropic_api_key")) {
    showApiKeyRequest.value = true;
}

const apiKeyInput = ref<string>("");

function handleApiKeySubmit() {
    if (!apiKeyInput.value.trim()) {
        return;
    }
    localStorage.setItem("anthropic_api_key", apiKeyInput.value);
    apiKeyInput.value = "";
    showApiKeyRequest.value = false;
}
</script>

<template>
    <header>
        <h1>Claude 3.5 Sonnet</h1>
    </header>
    <form
        v-if="showApiKeyRequest"
        class="api-key-form"
        @submit.prevent="handleApiKeySubmit"
    >
        <label>Input the Anthropic API key here </label>
        <div>
            <input v-model="apiKeyInput" />
            <button>submit</button>
        </div>
    </form>
    <template v-else>
        <Chat class="chat-container" :chat-data="claudeChat.activeChat" />
        <PromptInput class="prompt-input" @send-prompt="onPrompt" />
    </template>
</template>

<style scoped>
h1 {
    font-size: 20px;
}
.chat-container {
    flex-grow: 1;
    overflow: auto;
}
header {
    width: 100%;
    text-align: center;
    box-shadow:
        0 4px 6px -1px rgba(255, 255, 255, 0.1),
        0 2px 4px -1px rgba(255, 255, 255, 0.06);
}

.reset-chat-btn {
    border-radius: 50%;
    height: clamp(4rem, 4rem, 4rem);
    width: clamp(4rem, 4rem, 4rem);
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}

.api-key-form {
    padding: 20rem;
    display: flex;
    flex-direction: column;
    gap: 1.5 rem;
    & input {
        width: 20rem;
        margin-right: 10px;
        padding: 0.5rem;
    }
}
</style>
