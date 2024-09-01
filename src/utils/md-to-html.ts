import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { enhanceCodeBlocks } from "@/utils/md-code-block-plugin";
import rehypeStarryNight from "rehype-starry-night";

export async function  mdToHtml(mdString: string) {
        const file = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(enhanceCodeBlocks)
            .use(rehypeStarryNight)
            .use(rehypeStringify, {
                allowDangerousCharacters: true,
                allowDangerousHtml: true,
            })
            .process(mdString);
        const str = String(file);
        return str
    }