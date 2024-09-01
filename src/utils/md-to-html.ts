import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { enhanceCodeBlocks } from "@/utils/md-code-block-plugin";

export async function mdToHtml(mdString: string) {
    // Only load starry night if there is code to highlight
    let rehypeStarryNight = mdString.includes("```")
        ? (await import("rehype-starry-night")).default
        : null;
    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(enhanceCodeBlocks)
        // @ts-expect-error
        .use(rehypeStarryNight)
        .use(rehypeStringify, {
            allowDangerousCharacters: true,
            allowDangerousHtml: true,
        })
        .process(mdString);
    const str = String(file);
    return str;
}
