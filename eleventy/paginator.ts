import type {EleventyConfig} from "11ty.ts";


export default function templates(eleventyConfig: EleventyConfig) {
    eleventyConfig.addNunjucksGlobal("paginationHelper", getPagination);
}

function getPagination(currentPage: number, totalPages: number, window = 1) {
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