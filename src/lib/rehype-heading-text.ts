import type {Element, Root} from "hast";

/**
 * Wraps the content of each h1 and h2 in `<span class="heading-text">`.
 *
 * Markdown section headings are flex rows, so the trailing hairline can fill the rest of the first line. Without
 * the wrapper, every child node would be its own flex item, and `🎮 **How to Play**` would render as two items
 * with the row's gap between them.
 *
 * TODO: can we do this with CSS only, without wrapping the heading content in a span?
 */
export default function rehypeHeadingText() {
    return (tree: Root) => {
        const visit = (node: Root | Element) => {
            for (const child of node.children) {
                if (child.type !== "element") continue;
                if (child.tagName === "h1" || child.tagName === "h2") wrap(child);
                else visit(child);
            }
        };
        visit(tree);
    };
}

function wrap(heading: Element) {
    const span: Element = {
        type: "element",
        tagName: "span",
        properties: {className: ["heading-text"]},
        children: heading.children,
    };
    heading.children = [span];
}
