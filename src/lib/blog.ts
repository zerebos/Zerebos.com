import {getCollection, type CollectionEntry} from "astro:content";
import {toSlug} from "./slug";

type BlogEntry = CollectionEntry<"blog">;

export interface TagPostGroup {
  tagSlug: string;
  tagName: string;
  posts: BlogEntry[];
  totalPosts: number;
}

export function getTagPostGroups(posts: BlogEntry[]): TagPostGroup[] {
  const tags = new Map<string, {tagName: string; posts: BlogEntry[];}>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      const slug = toSlug(tag);
      if (!tags.has(slug)) {
        tags.set(slug, {tagName: tag, posts: []});
      }
      tags.get(slug)!.posts.push(post);
    }
  }

  return [...tags.entries()].map(([tagSlug, value]) => ({
    tagSlug,
    tagName: value.tagName,
    posts: value.posts,
    totalPosts: value.posts.length
  }));
}

export function getTagCounts(posts: BlogEntry[]): Map<string, number> {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
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

export async function getBlogPosts(): Promise<BlogEntry[]> {
  return getCollection("blog", ({data}) => import.meta.env.DEV || !data.draft);
}

export async function getOrderedBlogPosts(): Promise<BlogEntry[]> {
  const posts = await getBlogPosts();
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function readingTime(markdown: string): number {
  // Count images before stripping
  const images = (markdown.match(/!\[.*?\]\(.*?\)/g) ?? []).length;

  // Strip code and markdown syntax
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/[#*_\[\]()>!-]/g, "");

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const totalSeconds = (words / 238) * 60 + images * 12;
  const minutes = Math.ceil(totalSeconds / 60);
  return minutes;
  // return `${minutes} min read`;
}