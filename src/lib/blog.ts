import type {CollectionEntry} from "astro:content";
import {toSlug} from "./slug";

type BlogEntry = CollectionEntry<"blog">;

export interface TagPaginationPage<TPost> {
  page: number;
  posts: TPost[];
}

export interface TagPaginationGroup<TPost> {
  tagSlug: string;
  tagName: string;
  posts: TPost[];
  totalPosts: number;
  totalPages: number;
  pages: Array<TagPaginationPage<TPost>>;
}

export function buildTagPagination(posts: BlogEntry[], pageSize: number): Array<TagPaginationGroup<BlogEntry>> {
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
    const totalPosts = value.posts.length;
    const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
    const pages: Array<TagPaginationPage<BlogEntry>> = [];

    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      pages.push({
        page,
        posts: value.posts.slice(start, end)
      });
    }

    return {
      tagSlug,
      tagName: value.tagName,
      posts: value.posts,
      totalPosts,
      totalPages,
      pages
    };
  });
}

export const toTagSlug = toSlug;

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