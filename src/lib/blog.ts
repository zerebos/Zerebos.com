import type {CollectionEntry} from "astro:content";
import {toSlug} from "./slug";
import {buildPagination, type PaginationResult} from "./pagination";

type BlogEntry = CollectionEntry<"blog">;

export interface TagPaginationGroup extends PaginationResult<BlogEntry> {
  tagSlug: string;
  tagName: string;
  posts: BlogEntry[];
  totalPosts: number;
}

export function buildTagPagination(posts: BlogEntry[], pageSize: number): TagPaginationGroup[] {
  const tags = new Map<string, {tagName: string; posts: BlogEntry[];}>();

  for (const post of posts) {
    for (const tag of post.data.blogTags ?? []) {
      const slug = toSlug(tag);
      if (!tags.has(slug)) {
        tags.set(slug, {tagName: tag, posts: []});
      }
      tags.get(slug)!.posts.push(post);
    }
  }

  return [...tags.entries()].map(([tagSlug, value]) => {
    const {totalPages, pages} = buildPagination(value.posts, pageSize);
    return {
      tagSlug,
      tagName: value.tagName,
      posts: value.posts,
      totalPosts: value.posts.length,
      totalPages,
      pages
    };
  });
}

export function getTagCounts(posts: BlogEntry[]): Map<string, number> {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.blogTags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return tagCounts;
}

export function getOrderedTags(tagCounts: Map<string, number>): Array<[string, number]> {
  return [...tagCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export function getTagBlurb(totalPosts: number): string {
  const participle = totalPosts === 1 ? "is" : "are";
  const postLabel = totalPosts === 1 ? "post" : "posts";
  return `There ${participle} ${totalPosts} blog ${postLabel} with this tag.`;
}