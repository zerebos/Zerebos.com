import type {CollectionsAPI} from "11ty.ts";


export function chunkArray(arr: unknown[], size: number) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

// TODO: de-dup with collections
export default (postType: string) => function (collection: CollectionsAPI) {
    const tagMap: Record<string, unknown[]> = {};
    collection.getFilteredByGlob("./src/blog/*.md")
        // @ts-expect-error cba
        .sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(item => {
            const tags = (item.data.blogTags || []) as string[];
            tags.forEach(tag => {
                if (!tagMap[tag]) tagMap[tag] = [];
                tagMap[tag].push(item);
            });
        });

    // Get each item that matches the tag
    const paginationSize = 3;
    const paginatedMap = [];
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
                hrefs: Array(max).fill(0).map((_, i) => `/${postType}/tags/${tagName}/${i === 0 ? "" : `${i + 1}/`}`)
            });
        }
    }

    return paginatedMap;
};
