import {IdAttributePlugin, HtmlBasePlugin} from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import {feedPlugin} from "@11ty/eleventy-plugin-rss";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {

    // Add Eleventy v3 plugins
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(IdAttributePlugin);
    eleventyConfig.addPlugin(HtmlBasePlugin);

    // RSS feed using official plugin with virtual template
    eleventyConfig.addPlugin(feedPlugin, {
        type: "rss",
        outputPath: "/feed.xml",
        collection: {
            name: "posts",
            limit: 10,
        },
        metadata: {
            language: "en",
            title: "Zerebos.com",
            subtitle: "Developer showcase and portfolio",
            base: "https://zerebos.com/",
            author: {
                name: "Zerebos",
            }
        }
    });

    // TODO: Enable Bundle plugin bundles (built-in to Eleventy v3)
    eleventyConfig.addBundle("css");

    // Folders to copy to output folder
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("src/scripts.js");
    eleventyConfig.addPassthroughCopy("src/styles.css");

    eleventyConfig.addFilter("percentOf", (percent, of = 255) => {
        percent = percent / 100;
        return of * percent;
    });

    eleventyConfig.addFilter("subtractFrom", (amount, from = 255) => {
        return from - amount;
    });

    eleventyConfig.addFilter("getElementByKey", (array, key, value) => {
        return array.find(e => e[key] === value);
    });

    eleventyConfig.addFilter("numLocale", (str) => {
        return parseInt(str).toLocaleString();
    });

    eleventyConfig.addFilter("stringify", (json, indent = 4) => {
        return JSON.stringify(json, null, indent);
    });

    eleventyConfig.addFilter("date", (dateTime, format = "en-US") => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        if (format === "YYYY-MM-DD") {
            return date.toISOString().split('T')[0];
        }
        return date.toLocaleDateString(format);
    });

    eleventyConfig.addFilter("absolute", function(url, base = "") {
        const filter = eleventyConfig.getFilter("htmlBaseUrl");
        return filter.apply(this, [url, "https://zerebos.com"]);
    });

    function getProjects(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/projects/*.md");
    }

    function getBlogPosts(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/blog/*.md")
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    eleventyConfig.addCollection("projects", function (collection) {
        return getProjects(collection);
    });

    eleventyConfig.addCollection("posts", function (collection) {
        return getBlogPosts(collection);
    });

    // Virtual Template - Generate dynamic sitemap
    eleventyConfig.addTemplate("sitemap.njk", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.all %}
  <url>
    <loc>{{ page.url | url | absoluteUrl | log }}</loc>
    <lastmod>{{ page.date.toISOString() }}</lastmod>
  </url>
{%- endfor %}
</urlset>`, {
        permalink: "/sitemap.xml",
        layout: false
    });

    return {
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist",
            data: "data",
            layouts: "layouts"
        }
    }
};