<script setup lang="ts">
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { computedAsync } from "@vueuse/core";
import type { ChatItem } from "@/components/chat.types.ts";
import { enhanceCodeBlocks } from "@/utils/md-code-block-plugin.ts";
import rehypeStarryNight from "rehype-starry-night";
import { ref, watch } from "vue";

const props = defineProps<{ chatItem: ChatItem }>();
const html = ref<string>();

watch(
    props,
    async (newValue) => {
        const file = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(enhanceCodeBlocks)
            .use(rehypeStarryNight)
            .use(rehypeStringify, {
                allowDangerousCharacters: true,
                allowDangerousHtml: true,
            })
            .process(props.chatItem.content);
        const str = String(file);
        console.log(str);
        html.value = str;
    },
    { immediate: true },
);
</script>

<template>
    <div v-html="html"></div>
</template>

<style>
.markdown-code-block {
    background-color: black;
    padding: 1rem;
}
.code-block-container {
    background-color: black;
    border-radius: 0.5rem;
    & .code-block-header {
        background-color: var(--coral);
        color: black;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem 0.5rem 0 0;
    }
    & > * {
        padding-inline: 1rem;
        padding-block: 0.5rem;
    }
}
</style>
