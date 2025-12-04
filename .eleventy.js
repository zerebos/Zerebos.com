import {IdAttributePlugin, HtmlBasePlugin} from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import {feedPlugin} from "@11ty/eleventy-plugin-rss";

/** @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig */
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

    // TODO: Consider Bundle plugin bundles (built-in to Eleventy v3)
    // eleventyConfig.addBundle("css");

    // Folders to copy to output folder
    eleventyConfig.addPassthroughCopy("assets");
    // eleventyConfig.addPassthroughCopy("src/scripts.js");
    // eleventyConfig.addPassthroughCopy("src/styles.css");

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

    eleventyConfig.addFilter("date", (dateTime, format = "en-US", opts = {}) => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        if (format === "YYYY-MM-DD") {
            return date.toISOString().split('T')[0];
        }
        return date.toLocaleDateString(format, opts);
    });

    eleventyConfig.addFilter("absolute", function (url, base = "") {
        const filter = eleventyConfig.getFilter("htmlBaseUrl");
        return filter.apply(this, [url, "https://zerebos.com"]);
    });

    eleventyConfig.addNunjucksGlobal("paginationHelper", getPagination);

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

    eleventyConfig.addCollection("blog", function (collection) {
        return getBlogPosts(collection);
    });

    // Create collections for each tag
    eleventyConfig.addCollection("blogTagsList", function (collection) {
        let tagSet = new Set();
        getBlogPosts(collection).forEach(item => {
            const tags = item.data.blogTags || [];
            tags.forEach(tag => tagSet.add(tag));
        });

        return [...tagSet].sort();
    });

    eleventyConfig.addCollection("blogTagsMap", function (collection) {
        let tagMap = {};
        getBlogPosts(collection).forEach(item => {
            const tags = item.data.blogTags || [];
            tags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(item);
            });
        });
        return tagMap;
    });

    eleventyConfig.addCollection("blogTagsPagination", doublePaginate("blog"));

    console.log(eleventyConfig.collections.blogTagsPagination);

    // Virtual Template - Generate dynamic sitemap
    eleventyConfig.addTemplate("sitemap.njk", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.all %}
  <url>
    <loc>{{ page.url | url | absolute }}</loc>
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
            layouts: "includes/layouts",
            includes: "includes",
        }
    };
};

function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

const doublePaginate = (postType) => function (collection) {
    // Get unique list of tags
    // const tagSet = new Set();
    // collection.getAllSorted().map(function(item) {
    //     if ("tags" in item.data) {
    //         if (!item.data.tags.includes(postType)) return;
    //         const tags = item.data.tags.filter(tag => !metaTags.includes(tag));


    //         // optionally filter things out before you iterate over?
    //         for (const tag of tags) {
    //             tagSet.add(tag);
    //         }

    //     }
    // });
    let tagMap = {};
    collection.getFilteredByGlob("./src/blog/*.md")
        .sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => {
            const tags = item.data.blogTags || [];
            tags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(item);
            });
        });

    // Get each item that matches the tag
    const paginationSize = 3;
    const paginatedMap = [];
    // const tagMap = collection[`${postType}TagsMap`];
    // const tagArray = [...tagSet];
    for (const tagName in tagMap) {
        const tagItems = tagMap[tagName];
        const pagedItems = chunkArray(tagItems, paginationSize);
        for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
            const num = pageNumber + 1;
            paginatedMap.push({
                tagName: tagName,
                pageNumber: pageNumber,
                pageData: pagedItems[pageNumber],
                href: {
                    first: `/${postType}/tags/${tagName}/`,
                    previous: pageNumber - 1 < 0 ? "" : `/${postType}/tags/${tagName}/${num - 1 === 1 ? "" : `${pageNumber - 1}/`}`,
                    next: pageNumber + 1 >= max ? "" : `/${postType}/tags/${tagName}/${num + 1}/`, // pageNumber < max
                    last: `/${postType}/tags/${tagName}/${max}/`
                },
                hrefs: Array(max).fill().map((e, i) => `/${postType}/tags/${tagName}/${i === 0 ? "" : `${i + 1}/`}`)
            });
        }
    }

    return paginatedMap;
};

function getPagination(currentPage, totalPages, window = 1) {
    const pages = [];
    pages.push(1);

    if (currentPage - window > 2) {
        pages.push("...");
    }

    const start = Math.max(2, currentPage - window);
    const end = Math.min(totalPages - 1, currentPage + window);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (currentPage + window < totalPages - 1) {
        pages.push("...");
    }

    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
}