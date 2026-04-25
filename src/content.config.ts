import {defineCollection, z} from "astro:content";
import {glob} from "astro/loaders";

const blog = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/blog"}),
    schema: z.object({
        title: z.string(),
        blurb: z.string(),
        date: z.coerce.date(),
        blogTags: z.array(z.string()).default([]),
        banner: z.string().optional(),
        layout: z.string().optional()
    })
});

const projects = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/projects"}),
    schema: z.object({
        title: z.string(),
        blurb: z.string(),
        icon: z.string().optional(),
        repo: z.string().optional(),
        banner: z.string().optional(),
        layout: z.string().optional()
    })
});

export const collections = {blog, projects};
