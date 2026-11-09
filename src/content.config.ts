import {defineCollection} from "astro:content";
import {z} from "astro/zod";
import {glob} from "astro/loaders";

const blog = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/blog"}),
    schema: ({image}) => z.object({
        title: z.string(),
        blurb: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        primaryTag: z.string().optional(), // shown after `Blog` in the post's breadcrumb
        banner: image().optional()
    }).refine((data) => !data.primaryTag || data.tags.includes(data.primaryTag), {
        message: "primaryTag must be one of the post's tags",
        path: ["primaryTag"],
    })
});

const projects = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/projects"}),
    schema: ({image}) => z.object({
        order: z.number().int().positive(),
        title: z.string(),
        blurb: z.string(),
        draft: z.boolean().default(false),
        icon: image().optional(),
        repo: z.string().optional(),
        website: z.url().optional(),
        websiteLabel: z.string().optional(), // the website button's text, "Visit the website" when unset
        banner: image().optional()
    }).refine((data) => !data.websiteLabel || data.website, {
        message: "websiteLabel needs a website",
        path: ["websiteLabel"],
    })
});

const pages = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/pages"}),
    schema: ({image}) => z.object({
        title: z.string(),
        blurb: z.string(),
        updated: z.coerce.date().optional(),
        banner: image().optional(),
        bannerAlt: z.string().optional(), // the banner's alt text, empty when unset
        bannerCaption: z.string().optional(), // shown under the banner in text-muted
    }).refine((data) => data.banner || (!data.bannerAlt && !data.bannerCaption), {
        message: "bannerAlt and bannerCaption need a banner",
        path: ["banner"],
    })
});

export const collections = {blog, projects, pages};
