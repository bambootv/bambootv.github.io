# Bamboo Blog — CLAUDE.md

## 1. Project Overview

Bamboo Blog is a personal static blog site built with Astro. The author (Bamboo) writes about web development, coding, and travel. Content is authored in Markdown/MDX and rendered as a Bootstrap-themed static site deployed to GitHub Pages.

## 2. Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Astro | ^6.4.4 |
| Content | Markdown / MDX | @astrojs/mdx ^6.0.2 |
| Styling | Bootstrap 4 (vendored) | static in `/public/css/` |
| RSS | @astrojs/rss | ^4.0.18 |
| Sitemap | @astrojs/sitemap | ^3.7.3 |
| Image processing | sharp | ^0.34.3 |
| Language | TypeScript (strict) | via tsconfig.json |
| Runtime | Node.js + npm | — |

## 3. Dev Commands

```bash
npm install          # install dependencies
npm run dev          # dev server at http://localhost:4321
npm run build        # production build → dist/
npm run preview      # preview the production build locally
```

Shortcut via Makefile: `make dev` runs `npm run dev`.

## 4. Core Logic Summary

There is no weight/scoring calculation in this project. Content pipeline is the core logic:

1. `src/content.config.ts` — defines the `blog` collection schema (title, description, pubDate, updatedDate?, heroImage?). All frontmatter is validated at build time via Zod.
2. `src/pages/blogg/[...slug].astro` — generates one static page per post using `getStaticPaths()` + `getCollection('blog')`.
3. `src/pages/rss.xml.js` — generates an RSS feed from the blog collection.

See [`.claude/docs/architecture.md`](.claude/docs/architecture.md) for the full routing and layout tree.

## 5. Key Constraints

- **Do not modify `/public/css/` or `/public/js/`** — these are vendored Bootstrap 4 + jQuery assets. Do not replace with npm packages.
- **Two layout systems coexist**: `MainLayout.astro` (Bootstrap theme, used for marketing pages) and `BlogPost.astro` (Astro default layout, used for blog posts). Do not merge them.
- **`src/consts.ts`** is the single source of truth for `SITE_TITLE` and `SITE_DESCRIPTION`. Never hardcode these values in pages.
- **`astro.config.mjs` `site` field** is currently set to `'https://example.com'`. Update to the real GitHub Pages URL before deploying. RSS and sitemap are broken until this is fixed.
- **Blog content lives only in `src/content/blog/`**. The glob pattern `**/*.{md,mdx}` picks up all files. Do not add subdirectories without updating `content.config.ts`.
- **`heroImage` uses Astro's `image()` schema** — paths must be relative to the markdown file or use `src/assets/`. Absolute URLs are not validated by Zod.
- **Language**: UI copy mixes English and Vietnamese intentionally. Do not translate or normalize without instruction.

## 6. Additional Documentation

- [`.claude/docs/architecture.md`](.claude/docs/architecture.md) — routing tree, layout system, page inventory
- [`.claude/docs/content_model.md`](.claude/docs/content_model.md) — blog collection schema, frontmatter fields, content authoring rules
- [`.claude/docs/styling.md`](.claude/docs/styling.md) — Bootstrap theme structure, vendored assets, CSS override points
