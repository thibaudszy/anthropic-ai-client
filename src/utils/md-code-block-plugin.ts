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
                                    className: "icon",
                                    onclick: "copyCode(this)",
                                },
                                h(
                                    "svg",
                                    {
                                        "aria-hidden": "true",
                                        width: "24",
                                        height: "24",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                    },
                                    h("path", {
                                        stroke: "currentColor",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z",
                                    }),
                                ),
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
