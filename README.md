# Zerebos.com

Personal website and portfolio for [zerebos.com](https://zerebos.com), including:

- Home page
- Projects index and project detail pages
- Blog index, post pages, and tag archives
- About and links pages

## Stack

- [Astro](https://astro.build/) (static site generation)
- TypeScript
- Astro Content Collections for blog and project content
- Bun for scripts and package management
- Cloudflare for production and preview deployments

## Local Development

Prerequisites:

- Bun 1.x+

Install dependencies:

```bash
bun install
```

Run dev server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Preview production build locally:

```bash
bun run preview
```

## Scripts

- `bun run dev`: Start Astro dev server
- `bun run build`: Build Astro static output to `dist/`
- `bun run preview`: Preview the built site locally
- `bun run check`: Run Astro type/content checks
- `bun run check:links`: Build the site, then verify built internal links in `dist/`
- `bun run check:links:dist`: Verify internal links against an existing `dist/` build
- `bun run check:links:dist -- --verbose`: Print every successful internal reference resolution while checking
- `bun run check:links:lychee`: Verify internal links using [lychee](https://github.com/lycheeverse/lychee/) if installed.
- `bun run check:assets`: Report which files under `public/assets/` and `src/assets/` appear unused
- `bun run deploy`: Build and deploy via Wrangler (manual deployment path)

## Content

- Blog posts: `src/content/blog/`
- Project entries: `src/content/projects/`
- Collection schema: `src/content.config.ts`

## Deployment

Deployments are no longer handled by GitHub Actions.

The site now deploys through Cloudflare's automated Workers/Pages build pipeline:

- Every push triggers an automated build/deploy pipeline.
- Every pull request gets an automatic preview release.

Cloudflare serves the generated static output from `dist/`.

## Notes

- The repository previously used Eleventy during migration.
- Astro is now the primary and active site build system.