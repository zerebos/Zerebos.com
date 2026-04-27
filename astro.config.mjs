import {defineConfig, fontProviders} from "astro/config";
import sitemap from "@astrojs/sitemap";

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
        smartypants: false
    },

    build: {
        format: "directory"
    },

    experimental: {
        rustCompiler: true
    }
});