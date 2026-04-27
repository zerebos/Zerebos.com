import rss from "@astrojs/rss";
import {getCollection} from "astro:content";
import type {APIContext} from "astro";

export async function GET(context: APIContext) {
    const posts = await getCollection("blog");
    const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).slice(0, 10);

    return rss({
        title: "Zerebos.com",
        description: "Developer showcase and portfolio",
        site: context.site ?? "https://zerebos.com",
        items: sorted.map(post => ({
            title: post.data.title,
            description: post.data.blurb,
            pubDate: post.data.date,
            link: `/blog/${post.id}`,
        })),
        customData: `<language>en</language>`,
    });
}
