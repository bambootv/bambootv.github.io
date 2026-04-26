# Styling

## Overview

The site uses two separate styling systems that correspond to the two layout types. Do not mix them.

## Bootstrap Theme (MainLayout pages)

All CSS and JS are **vendored** in `/public/css/` and `/public/js/`. They are loaded via `<link>` and `<script is:inline>` tags inside `MainLayout.astro`.

### Load Order (CSS)

1. `bootstrap.min.css` — Bootstrap 4 grid and components
2. `font-awesome.min.css` — icon font
3. `fontastic.css` — custom icon font
4. `custom_v2.css` — Google Fonts (Open Sans)
5. `jquery.fancybox.min.css` — lightbox for gallery
6. `style.default.css` — primary theme stylesheet (do not edit)
7. `custom.css` — **your override file** — put all custom CSS here

### Load Order (JS, bottom of body)

1. `jquery.min.js`
2. `popper.min.js`
3. `bootstrap.min.js`
4. `jquery.cookie.js`
5. `jquery.fancybox.min.js`
6. `front.js` — theme interaction scripts (scroll, navbar toggle, color switcher)

**Rule:** Never edit `style.default.css` or `bootstrap.min.css`. All overrides go into `custom.css`.

## Astro Default Styles (BlogPost pages)

Blog post pages use `BlogPost.astro` which imports `global.css` via `BaseHead.astro` (`src/styles/global.css`). This stylesheet is separate from the Bootstrap theme and uses CSS custom properties (`--box-shadow`, `--gray`, `--gray-dark`).

The `BlogPost.astro` layout also contains inline `<style>` scoped to that component (prose container width, hero image sizing, etc.).

## Theme Color Switcher

`front.js` includes a runtime color switcher that sets `#new-stylesheet` (an empty `<link id="new-stylesheet">` in `MainLayout.astro`). This allows theme color variation without changing source files. It is cosmetic only — ignore it unless working on theme customization.

## Responsive Breakpoints

Bootstrap 4 breakpoints apply:
- `col-lg-*` — desktop (≥992px)
- `col-md-*` — tablet (≥768px)
- `col-sm-*` — mobile (≥576px)

The navbar collapses at `navbar-expand-lg` (992px).
