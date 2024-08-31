<script setup lang="ts">
import Chat from "./components/Chat.vue";
import PromptInput from "./components/PromptInput.vue";
</script>

<template>
    <div class="app-content">
        <main class="main-content">
            <Chat class="chat-container" />
            <PromptInput class="prompt-input" />
        </main>
    </div>
</template>

<style scoped>
.app-content {
    height: 100dvh;
    width: 100%;
    display: flex;
}
.main-content {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    width: 100%;
}
.chat-container {
    flex-grow: 1;
}
</style>
