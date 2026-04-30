import {getCollection} from "astro:content";
import type {CollectionEntry} from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

export async function getOrderedProjects(): Promise<ProjectEntry[]> {
    const projects = await getCollection("projects", ({data}) => import.meta.env.DEV || !data.draft);

    return projects.sort((a, b) => {
        if (a.data.order !== b.data.order) {
            return a.data.order - b.data.order;
        }

        return a.data.title.localeCompare(b.data.title);
    });
}
