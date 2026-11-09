import {defineConfig, fontProviders} from "astro/config";
import sitemap from "@astrojs/sitemap";
import {rehypeHeadingIds} from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHeadingText from "./src/lib/rehype-heading-text.ts";

export default defineConfig({
    site: "https://zerebos.com",
    output: "static",
    trailingSlash: "never",
    integrations: [sitemap()],

    fonts: [{
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-inter",
        weights: [400, 500, 600, 700],
        styles: ["normal"],
    }],

    markdown: {
        smartypants: false,
        // ids HAS TO come first so Astro collects each heading's text before the wrapper and the `#` link are added.
        rehypePlugins: [
            rehypeHeadingIds,
            rehypeHeadingText,
            [rehypeAutolinkHeadings, {
                behavior: "append",
                content: {type: "text", value: "#"},
                properties: {className: ["anchor"], ariaLabel: "Link to this section"},
            }],
        ],
        shikiConfig: {
            theme: "dark-plus",
        },
    },

    build: {
        format: "directory"
    },

    experimental: {
        rustCompiler: true
    }
});