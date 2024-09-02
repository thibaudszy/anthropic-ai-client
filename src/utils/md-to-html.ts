import PQueue from "p-queue";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { enhanceCodeBlocks } from "./md-code-block-plugin";

export class MdToHtml {
    private queue: PQueue;
    private latestMdString: string | null = null;
    private rehypeStarryNight: Function | null;

    constructor() {
        this.queue = new PQueue({ concurrency: 1 });
        this.rehypeStarryNight = null;
    }

    public async transpile(mdString: string): Promise<string> {
        this.latestMdString = mdString;
        if (!this.rehypeStarryNight && mdString.includes("```")) {
            this.rehypeStarryNight = (
                await import("rehype-starry-night")
            ).default;
        }

        // Clear the queue of any pending tasks
        this.queue.clear();

        // Add the new task to process the latest mdString
        return this.queue.add(() =>
            this.processLatestMdString(),
        ) as Promise<string>;
    }

    private async processLatestMdString(): Promise<string> {
        const currentMdString = this.latestMdString;
        this.latestMdString = null;

        if (currentMdString == null) {
            throw new Error("No markdown string to process");
        }
        return this.mdToHtml(currentMdString);
    }

    private async mdToHtml(mdString: string): Promise<string> {
        const file = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(enhanceCodeBlocks)
            // @ts-expect-error
            .use(this.rehypeStarryNight)
            .use(rehypeStringify)
            .process(mdString);
        const str = String(file);
        return str;
    }
}
