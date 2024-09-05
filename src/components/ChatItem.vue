<script setup lang="ts">
import type { ChatItem } from "./chat.types";

defineProps<{ chatItem: ChatItem }>();
</script>

<template>
    <div v-html="chatItem.htmlContent"></div>
</template>

<style>
.markdown-code-block {
    background-color: black;
    padding: 1rem;
}
.code-block-container {
    margin-block: 1rem;
    background-color: black;
    border-radius: 0.5rem;
    overflow-x: hidden;
    position: relative;
    & .code-block-header {
        background-color: var(--coral);
        position: sticky;
        top: 0;
        color: black;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem 0.5rem 0 0;
        & .copy-button {
            & .copy {
                display: visible;
            }
            & .check {
                display: none;
            }
        }
        & .copy-button.active {
            & .copy {
                display: none;
            }
            & .check {
                display: block;
            }
        }
    }
    & > * {
        padding-inline: 1rem;
        padding-block: 0.5rem;
        overflow: auto;
    }
}
</style>
