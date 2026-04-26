# Content Model

## Blog Collection

Defined in `src/content.config.ts`. Collected via glob from `src/content/blog/**/*.{md,mdx}`.

### Frontmatter Schema (Zod)

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | yes | Post heading |
| `description` | `string` | yes | Used in meta tags and RSS |
| `pubDate` | `z.coerce.date()` | yes | Accepts string or Date; coerced at build time |
| `updatedDate` | `z.coerce.date()` | no | Displayed as "Last updated on…" |
| `heroImage` | `image()` | no | Must be a relative path from the `.md` file or inside `src/assets/`. Processed by sharp. |

### Example Frontmatter

```md
---
title: 'My Post Title'
description: 'A short summary shown in RSS and meta tags.'
pubDate: '2024-03-01'
updatedDate: '2024-04-10'
heroImage: '../../assets/blog-placeholder-1.jpg'
---
```

### Authoring Rules

- Place `.md` or `.mdx` files in `src/content/blog/`. The filename becomes the URL slug (e.g., `my-post.md` → `/blogg/my-post`).
- `heroImage` references must be relative to the markdown file or point into `src/assets/`. Absolute URLs are **not** validated by Zod and will bypass image optimization.
- `pubDate` accepts human-readable date strings (`'Jul 08 2022'`) — Zod coerces them. ISO 8601 (`'2022-07-08'`) also works.
- MDX files (`.mdx`) can import and use Astro components inline.

## RSS Feed

`src/pages/rss.xml.js` maps all blog posts to RSS items. The `link` field uses `/blog/${post.id}/` — note this path differs from the actual page route `/blogg/[slug]`. Fix this if RSS link accuracy matters.

## Global Site Constants

`src/consts.ts` exports:
- `SITE_TITLE` — used in `<BaseHead>` title and RSS feed title.
- `SITE_DESCRIPTION` — used in RSS feed description.

Update these values when the site identity changes. Do not hardcode them elsewhere.
