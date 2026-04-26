# Architecture

## Routing Tree

```
/                        → src/pages/index.astro         (MainLayout, Bootstrap hero page)
/about                   → src/pages/about.astro
/contact                 → src/pages/contact.astro
/blog                    → src/pages/blog.astro           (static placeholder page)
/post                    → src/pages/post.astro           (static placeholder page)
/blogg/                  → src/pages/blogg/index.astro    (blog listing)
/blogg/[slug]            → src/pages/blogg/[...slug].astro (individual post, SSG)
/rss.xml                 → src/pages/rss.xml.js           (RSS feed endpoint)
/404                     → src/pages/404.astro
```

**Note:** The blog listing/post route is `/blogg/` (double-g). This is intentional — do not rename without updating all internal links.

## Layout System

Two separate layouts exist and must not be merged:

### `MainLayout.astro`
- Used by: `index.astro`, `about.astro`, `contact.astro`, and other marketing pages.
- Embeds the full Bootstrap 4 navbar, footer, and vendored JS inline.
- Accepts props: `title: string`, `description?: string`, `activeNav?: 'home' | 'library' | 'about' | 'contact'`.
- `activeNav` drives the active state on the navbar links.
- All scripts loaded at bottom via `is:inline` (jQuery, Bootstrap, Fancybox, front.js).

### `BlogPost.astro`
- Used by: `src/pages/blogg/[...slug].astro`.
- Minimal layout: `<Header />`, `<main>`, `<Footer />` components, no Bootstrap JS.
- Renders `heroImage` via Astro's `<Image>` with fixed dimensions `1020×510`.
- Displays `pubDate` and optional `updatedDate` via `<FormattedDate />`.

## Component Inventory

| Component | Purpose |
|---|---|
| `BaseHead.astro` | `<head>` meta, OG tags, RSS link, canonical URL. Used only inside `BlogPost.astro`. |
| `Header.astro` | Minimal standalone header for blog post pages. |
| `Footer.astro` | Minimal standalone footer for blog post pages. |
| `FormattedDate.astro` | Formats a `Date` object for display. |
| `HeaderLink.astro` | Styled `<a>` used inside `Header.astro`. |

## Static Assets

All static files are in `/public/`. Astro copies them verbatim to `dist/` at build time.

```
/public/
  css/          ← vendored Bootstrap 4, Font Awesome, Fancybox, custom theme
  js/           ← vendored jQuery, Bootstrap JS, Fancybox, front.js
  img/          ← hero images, gallery photos, author avatars
  fonts/        ← Atkinson font (woff)
```

## Build Output

`npm run build` produces `dist/` as a fully static site. No SSR adapter is configured — output mode is `static` (Astro default).
