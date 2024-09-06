<script setup lang="ts">
import NewChat from "./NewChat.vue";
import ChatHistory from "./ChatHistory.vue";
</script>

<template>
    <aside>
        <header>
            <h2>Chat history</h2>

            <NewChat />
        </header>
        <ChatHistory class="history" />
    </aside>
</template>

<style scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 0.5rem;
    padding-block: 0.5rem;
}
aside {
    border-right: 2px solid var(--ghost-white);
    display: flex;
    flex-direction: column;
    & .history {
        flex-grow: 1;
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
