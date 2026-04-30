import rss from "@astrojs/rss";
import type {APIContext} from "astro";
import {getBlogPosts} from "../lib/blog";
import {BLOG_DESCRIPTION, SITE_URL, SITE_TITLE} from "../lib/config";

export async function GET(context: APIContext) {
    const posts = await getBlogPosts();
    const sorted = [...posts]
        .sort((a, b) => {
            const byDate = b.data.date.getTime() - a.data.date.getTime();
            return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
        })
        .slice(0, 25);

    const latestChange = sorted.reduce((latest, post) => {
        const changedAt = post.data.updated ?? post.data.date;
        return changedAt.getTime() > latest.getTime() ? changedAt : latest;
    }, new Date(0));

    return rss({
        title: `${SITE_TITLE}.com`,
        description: BLOG_DESCRIPTION,
        site: context.site ?? SITE_URL,
        items: sorted.map(post => ({
            title: post.data.title,
            description: post.data.blurb,
            pubDate: post.data.date,
            categories: post.data.blogTags,
            link: `/blog/${post.id}`,
        })),
        customData: `<language>en</language><lastBuildDate>${latestChange.toUTCString()}</lastBuildDate><atom:link href="${new URL("/feed.xml", context.site ?? SITE_URL).toString()}" rel="self" type="application/rss+xml" />`,
        xmlns: {
            atom: "http://www.w3.org/2005/Atom"
        }
    });
}
