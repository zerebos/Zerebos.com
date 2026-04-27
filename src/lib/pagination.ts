export interface PaginationPage<T> {
    page: number;
    items: T[];
}

export interface PaginationResult<T> {
    totalPages: number;
    pages: Array<PaginationPage<T>>;
}

export function buildPagination<T>(items: T[], pageSize: number): PaginationResult<T> {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const pages: Array<PaginationPage<T>> = [];

    for (let page = 1; page <= totalPages; page++) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        pages.push({page, items: items.slice(start, end)});
    }

    return {totalPages, pages};
}
