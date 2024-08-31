import { visit } from "unist-util-visit";

export function enhanceCodeBlocks() {
    return (tree) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "pre" && node.children[0].tagName === "code") {
                node.properties.className = ["markdown-code-block"];
            }
        });
    };
}
