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
            .use(rehypeStringify)
            .process(props.chatItem.content);
        html.value = String(file);
    },
    { immediate: true },
);
</script>

<template>
    <div v-if="html" v-html="html"></div>
</template>

<style>
.markdown-code-block {
    background-color: black;
    padding: 1rem;
}
</style>
