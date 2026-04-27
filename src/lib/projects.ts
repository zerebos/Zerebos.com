import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

export async function getOrderedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects");

  return projects.sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }

    return a.data.title.localeCompare(b.data.title);
  });
}
