---
title: "Migrating Zerebos.com to Astro"
blurb: "Why I moved this site off Eleventy, Nunjucks, and Stylus, what the move actually involved, and the handful of things that tripped me up along the way."
date: 2026-04-30
tags: ["astro", "eleventy", "static-site-generator", "web-development", "typescript"]
banner: ../../assets/blog/astro-migration.webp
---

This site has been running on more or less the same stack since 2023: [Eleventy](https://www.11ty.dev/) for the build, Nunjucks for the templates, and Stylus for the styles. It worked. It worked fine, even. But every time I sat down to change something, I spent more time remembering how the pieces fit together than actually changing anything.

So I did what any reasonable developer does with a perfectly functional personal site... I rewrote it! It's now built with [Astro](https://astro.build/).

To be clear, I'm not declaring "framework X is dead, long live framework Y". Although, [some people](https://brennan.day/the-end-of-eleventy/) are indeed [doing this](https://davidmatthew.ie/to-astro-from-11ty/). I think Eleventy is great and I'd still recommend it. This is just what the move looked like for a small, mostly static site, and the stuff I wish I'd known going in.

<!-- --- -->

## Why Bother?

**Short answer:** TypeScript.

**Long answer:** A few small annoyances had been piling up for a while.

**Longer answer:**

Nunjucks doesn't know what types are. No autocomplete, no type checking, and when a template breaks you get an error message that's somehow both a wall of text and *completely* unhelpful.

Layout inheritance got *really* messy. `base.njk` → `basic.njk` → `post.njk` is fine right up until one page needs to be *slightly* different, and then you're threading things through three levels of `{% block %}` tags.

Data and templates lived in separate worlds. Eleventy's data cascade is powerful, but the data files and the templates that used them never really felt connected. Things worked, but you could see the seams and they were ready to burst.

Astro handles all three of these much more gracefully. Components are `.astro` files that look like HTML with a TypeScript block on top, so you get real types and real editor support. Layouts are just components wrapping other components. And the data logic can live right next to the markup that uses it.

The other big draw was content collections. Your frontmatter gets an actual schema, so a typo in a post's metadata breaks the build instead of quietly rendering a broken page. Each collection also gets its own schema, so blog posts and projects can both have a `tags` field without stepping on each other. Eleventy reserves `tags` for building collections, so mine had to be called `blogTags`, plus a few hacky workarounds.

## What Even Is This Site?

For context, here's everything the site actually does:

- A home page with GitHub stats, project and blog previews, and a contact form
- A projects index and a page for each project
- A blog index and a page for each post
- Tag pages, with post counts
- About and Links pages
- An RSS feed and a sitemap
- GitHub data pulled in at build time and cached for a day

No accounts, no database, no server-rendered anything. If there's a perfect candidate for an Astro migration, this is pretty much it.

## The Migration

### Content Collections

Moving the blog posts and projects over was easily the smoothest part. Here's what the blog schema in `src/content.config.ts` looks like now:

```typescript
const blog = defineCollection({
    loader: glob({pattern: "**/*.md", base: "./src/content/blog"}),
    schema: ({image}) => z.object({
        title: z.string(),
        blurb: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        banner: image().optional()
    })
});
```

If a post is missing a field or has the wrong type, the build fails and tells you exactly which file and which field. Compared to "huh, why is that date blank?" this is a massive upgrade.

The `image()` helper is a nice touch too. A banner path that doesn't point at a real file fails the build, and the ones that do get run through Astro's image pipeline automatically.

There was one thing that caught me off guard though... entries loaded with `glob()` don't have a `slug` anymore. You route with `entry.id` instead, which is the file's path relative to the loader's base. Not a big deal once you know, but I definitely spent a minute staring at `undefined`.

### Routes and Pagination

Astro's file-based routing mapped over pretty cleanly. The simple pages are just `.astro` files in `src/pages/`, and the dynamic ones use bracket syntax:

- `src/pages/blog/[slug].astro` for posts
- `src/pages/projects/[slug].astro` for projects
- `src/pages/blog/tags/[tag]/index.astro` for tag pages

Pagination got its own folders so it wouldn't fight with the `[slug]` routes, so page two of the blog now lives at `/blog/page/2`. I also turned trailing slashes off entirely while I was at it, because I could.

Tag pages are where Astro really won me over. In Eleventy, per-tag collections meant custom collection functions in the config. In Astro, it's just a function that groups posts by tag, called from `getStaticPaths()` in the route that uses it. The tag pages and the paginated tag pages both share the same grouping logic, so I'm not maintaining the same loop in two places.

### GitHub Data

The old site had a `src/data/github.js` file that Eleventy ran as part of its data cascade. Now it's `src/lib/github.ts`, a regular TypeScript module that the pages import directly. No special conventions, it's just normal code that runs at build time.

Caching works *about* the same as before. Each GitHub API response gets written to its own file in `.cache/github/`, and a cached file is reused until it's a day old. If a request fails (say, from hitting the rate limit without a token), that piece of data just gets left out instead of taking the build down with it.

### Styling

The Stylus is gone! I originally planned to save that for later, but once everything else was moved over it felt silly to keep a whole preprocessor around for one site. So the styles are plain CSS now, split into a file per component and section, with the colors pulled out into custom properties in a tokens file.

I did turn off Astro's smart quotes (`smartypants: false`). The existing content and styles were written expecting plain straight quotes, and having Astro swap them for curly ones made things look subtly off.

### All the Other Stuff

A bunch of smaller things came along for the ride, mostly because Astro made them easy:

- Images go through `astro:assets` now, so they get resized and optimized at build time
- The Inter font is served locally through Astro's font support instead of from Google
- Code highlighting uses Astro's built-in Shiki instead of Prism, which is one less dependency
- View transitions between pages, because they look cool
- Canonical URLs and per-page Open Graph tags, all handled in one `BaseLayout.astro`
- The RSS feed uses `@astrojs/rss` and the sitemap uses `@astrojs/sitemap`, with way less boilerplate than the Eleventy versions

I also turned on Astro's experimental Rust compiler. Has it caused any problems? Not yet. Will it? Probably.

## What Surprised Me

The component model is just nice. `BlogPostPreview`, `PageHeader`, and `TagList` replaced a tangle of Nunjucks macros and partials. Each one is a single file with its own props type and its own markup. Easy to read, easy to change.

TypeScript caught real bugs. Not hypothetical ones! A few things in the old templates had been quietly wrong for who knows how long, and the type checker flagged them almost immediately.

Muscle memory is real. I caught myself typing `{% if %}` more times than I'd like to admit.

The build is still quick. The full build is about three and a half seconds for the whole site, GitHub stats included. Eleventy was in the same ballpark, so no complaints there.

## Deploying

The site is hosted on Cloudflare, which builds and deploys automatically on every push to `main`. I can also deploy by hand with `bun run deploy` if I need to.

This part was not quite as smooth as I'd hoped. My first instinct was to add Cloudflare's Astro adapter, and I have a commit in the history literally titled "Fix cloudflare build hopefully." Then I realized the whole site is static, so the adapter wasn't doing anything for me. I ripped it out, and now `wrangler.jsonc` just points Cloudflare at the build output:

```jsonc
{
    "assets": {
        "directory": "dist"
    }
}
```

On top of that, a GitHub Actions workflow runs on every push and pull request. It runs `astro check` for types, does a full build, then runs two little scripts I wrote: one makes sure every internal link actually goes somewhere, and the other flags any images I forgot to clean up.

## What's Left

The migration itself is done, but there's always more:

- **Tags for projects.** Now that I'm using Astro, I can properly use `tags` for both projects and blog posts without any collision or explosion!
- **More posts.** I have a pile of drafts sitting in a notes folder. This was one of them, which feels appropriately recursive.

## Final Thoughts

Was it worth it? For me, yeah. The codebase is way easier to work in, and I don't have to keep switching my brain between TypeScript and a template language that doesn't know TypeScript exists.

If you're running a content-heavy personal site on Eleventy and eyeing Astro, the concepts map over closely enough that you won't feel lost. Honestly, content collections alone are worth the move.
