# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal bilingual blog (Vietnamese at `/`, English at `/en/`) built with Astro as a fully static site, deployed to GitHub Pages at https://bambootv.github.io. No database, no server runtime. The README is in Vietnamese and documents the content rules for the author; keep it in sync when those rules change.

## Commands

```bash
npm run dev               # http://localhost:4321 (also `make dev`)
npm run dev -- --force    # rebuild the content cache; use after editing src/content.config.ts or renaming content folders
npm run check             # astro check (type-check .astro/.ts); there is no linter and no test suite
npm run build             # static output to dist/; this is where content-structure errors surface
npm run preview
```

Deploy: pushing to the `deployment` branch runs `.github/workflows/deploy.yml` (withastro/action, Node 22). `master` is the PR base branch, not the deploy branch.

## Content model: topic → series → chapter → post

Everything lives in `src/content/topics/<lang>/`, exactly four levels deep. Each folder with an `index.md` is a node; posts are `NN-slug.md(x)` files and only sit inside chapter folders.

- `src/content.config.ts` defines two collections over the same tree: `series` (every `index.md` below a language folder: topics, series and chapters alike) and `posts` (files starting with a digit).
- `src/lib/posts.ts` is the core. `getTopics(lang)` builds the whole tree, picks the right language file per node, numbers siblings by `order`, and **throws build errors** for structural violations (missing `index.md`, folders inside a chapter, posts outside a chapter, a post slug colliding with a sibling folder, a topic named after a reserved URL segment). Topics, series and chapters share the `Series` type and are distinguished by `level` (depth).
- URLs mirror folders with `series` inserted after the topic: `/<topic>/series/<series>/<chapter>/<slug>/`. The `NN-` prefix is ordering only and is stripped from the URL.
- A single catch-all route `src/pages/[topic]/series/[...path].astro` renders every topic, series, chapter and post page, using `getSeriesRouteStaticPaths(lang)`, which returns either `{ kind: 'series' }` (→ `SeriesView`) or `{ kind: 'post', prev, next }` (→ `PostView`). Prev/next run across all chapters of one series in reading order.
- `RESERVED` in `posts.ts` must include every top-level page name under `src/pages/`; update it when adding a new top-level page.

## i18n

- Astro i18n with `vi` as default locale, unprefixed (`prefixDefaultLocale: false`). Locales are also listed in `src/i18n/ui.ts` (`languages`, `defaultLang`) and in the sitemap config in `astro.config.mjs`.
- Every page under `src/pages/en/` is a thin wrapper that imports the Vietnamese page and re-exports it (for dynamic routes it calls `getSeriesRouteStaticPaths('en')`). Add new pages in Vietnamese first, then add the matching `en/` wrapper; put language-dependent logic in the shared page via `getLang(Astro.currentLocale)`.
- Content translation is per file: `src/content/topics/en/...` with the same path and file name as the `vi` file. Missing translations fall back to the Vietnamese file (`pick()` in `posts.ts`); the page then shows a fallback notice and `MainLayout` sets `canonical` to the Vietnamese URL. Untranslated posts are excluded from the English RSS (`src/lib/feed.ts`).
- UI strings live in `src/i18n/ui.ts`; the `en` object is typed against `vi`'s keys, so every new key must be added to both.

## Theme

The look comes from the "Bootstrap Blog" theme (Bootstrap Temple). Its CSS/JS/fonts/images in `public/` are kept verbatim and loaded by `src/layouts/MainLayout.astro`; site-specific styles go in `public/css/custom*.css` or `src/styles/prose.css` (Markdown body), not in the theme files.

Keep pages as close to the original theme markup as possible, including sample blocks that don't work on a static site yet (sidebar search/tags/categories, comments and comment form, view counts, contact and newsletter forms, the home page). Hard-code them rather than removing or redesigning them; the author will wire up real data later. The original converted theme pages are in commit `a4befcc`, and the raw theme is in `bak/theme.zip`. Current posts and series under `src/content/` are placeholder data.

Style reference: combine two styles, the original theme and Medium (https://medium.com). Use Medium as the reference for things like typography, line length, spacing, the reading experience of a post, and how lists of posts and series are presented, applied through the site-specific stylesheets above. When the two conflict (for example, Medium would drop or redesign a theme block, or the theme's look differs from Medium's), don't pick one silently: tell the user what the conflict is, show the options, and let them choose.

## Git workflow

Before starting a task, check the current branch. If it is `master` and the working tree is clean, create a new branch named after what the task does (short kebab-case, e.g. `medium-style-typography`, `add-tags-page`) and do the work there.
