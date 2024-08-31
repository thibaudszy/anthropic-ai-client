import { visit } from "unist-util-visit";
import { h } from "hastscript";

export function enhanceCodeBlocks() {
    return (tree) => {
        visit(tree, "element", (node, index, parent) => {
            if (node.tagName === "pre" && node.children[0].tagName === "code") {
                // Get the language from the className of the code element
                const className = node.children[0].properties.className || [];
                const language =
                    className.find((cls) => cls.startsWith("language-")) || "";
                const languageName =
                    language.replace("language-", "") || "Unknown";

                // Create a div for the code block container
                const codeContainer = h(
                    "div",
                    { className: "code-block-container" },
                    [
                        h("div", { className: "code-block-header" }, [
                            h(
                                "span",
                                { className: "code-block-title" },
                                languageName,
                            ),
                            h(
                                "button",
                                {
                                    className: "copy-button",
                                    onclick: "copyCode(this)",
                                },
                                "Copy",
                            ),
                        ]),
                        node,
                    ],
                );

                // Replace the <pre> node with the new container
                parent.children[index] = codeContainer;
            }
        });
    };
}
