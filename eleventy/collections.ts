import type {CollectionsAPI, EleventyConfig} from "11ty.ts";
import doublePaginate from "./utils/doublepagination.ts";


export default function templates(eleventyConfig: EleventyConfig) {
    function getProjects(collectionApi: CollectionsAPI) {
        return collectionApi.getFilteredByGlob("./src/projects/*.md");
    }

    function getBlogPosts(collectionApi: CollectionsAPI) {
        return collectionApi.getFilteredByGlob("./src/blog/*.md")
            // @ts-expect-error cba
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
        const tagSet = new Set<string>();
        getBlogPosts(collection).forEach(item => {
            const tags = (item.data.blogTags || []) as string[];
            tags.forEach(tag => tagSet.add(tag));
        });

        return [...tagSet].sort();
    });

    eleventyConfig.addCollection("blogTagsMap", function (collection) {
        const tagMap: Record<string, unknown[]> = {};
        getBlogPosts(collection).forEach(item => {
            const tags = (item.data.blogTags || []) as string[];
            tags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(item);
            });
        });
        return tagMap;
    });

    eleventyConfig.addCollection("blogTagsPagination", doublePaginate("blog"));
}
