import type {EleventyConfig} from "11ty.ts";
import {feedPlugin} from "@11ty/eleventy-plugin-rss";


export default function templates(eleventyConfig: EleventyConfig) {
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
}