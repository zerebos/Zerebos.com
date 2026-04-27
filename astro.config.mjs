import {defineConfig} from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://zerebos.com",
    output: "static",
    integrations: [sitemap()],

    markdown: {
        smartypants: false
    },

    build: {
        format: "directory"
    },

    experimental: {
        rustCompiler: true
    }
});