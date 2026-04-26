import type {EleventyConfig} from "11ty.ts";
import {IdAttributePlugin, HtmlBasePlugin} from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

import collections from "./eleventy/collections.ts";
import templates from "./eleventy/templates.ts";
import filters from "./eleventy/filters.ts";
import paginator from "./eleventy/paginator.ts";


export default async function (eleventyConfig: EleventyConfig) {
    // TODO: Consider Bundle plugin bundles (built-in to Eleventy v3)

    // Add Eleventy v3 plugins
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(IdAttributePlugin);
    eleventyConfig.addPlugin(HtmlBasePlugin);

    // Folders to copy to output folder
    eleventyConfig.addPassthroughCopy("assets");

    // Apply custom configuration
    collections(eleventyConfig);
    templates(eleventyConfig);
    filters(eleventyConfig);
    paginator(eleventyConfig);

    return {
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "build",
            data: "data",
            layouts: "includes/layouts",
            includes: "includes",
        }
    };
}
