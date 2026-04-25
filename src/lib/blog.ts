import type { CollectionEntry } from "astro:content";

type BlogEntry = CollectionEntry<"blog">;

export const toTagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function getTagCounts(posts: BlogEntry[]): Map<string, number> {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.blogTags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return tagCounts;
}

export function getOrderedTags(tagCounts: Map<string, number>): [string, number][] {
  return [...tagCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export function getTagBlurb(totalPosts: number): string {
  const participle = totalPosts === 1 ? "is" : "are";
  const postLabel = totalPosts === 1 ? "post" : "posts";
  return `There ${participle} ${totalPosts} blog ${postLabel} with this tag.`;
}