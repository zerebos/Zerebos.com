import {defineCollection} from "astro:content";
import {z} from "astro/zod";
import {glob} from "astro/loaders";

const blog = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/blog"}),
    schema: ({image}) => z.object({
        title: z.string(),
        blurb: z.string(),
        date: z.coerce.date(),
        blogTags: z.array(z.string()).default([]),
        banner: image().optional()
    })
});

const projects = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/projects"}),
    schema: ({image}) => z.object({
        order: z.number().int().positive(),
        title: z.string(),
        blurb: z.string(),
        icon: image().optional(),
        repo: z.string().optional(),
        banner: image().optional()
    })
});

export const collections = {blog, projects};
