# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## Claude init
```
<role>
  You are a Tech Lead onboarding a new engineer onto Bamboo Blog (our blog).
  </role>

  <context>
  With Bamboo Blog, users can write my personal experience or knowledge I have. It is web devoploper, coder and traveler.
  </context>

  <task>
  Generate a CLAUDE.md file in the root directory.
  Additionally, apply progressive disclosure by creating separate documentation files within the `.claude/docs/` directory for any detailed technical domains (e.g.,
  `.claude/docs/architecture.md`, `.claude/docs/state_management.md`, `.claude/docs/date_logic.md`).
  </task>

  <requirements>
  - CLAUDE.md must be a maximum of 150 lines. Focus only on universally applicable information.
  - Use Progressive Disclosure: Keep CLAUDE.md strictly as a high-level index and routing file. Extract all deep technical details, data models, component structures, and complex logic
  into appropriately named separate files inside `.claude/docs/`.
  - Written for an agent/developer who has never seen this codebase.
  - Every section must be actionable, not decorative.
  </requirements>

  Include exactly these sections in CLAUDE.md in this order:
  1. Project Overview: what GoalStack does in 2-3 sentences.
  2. Tech Stack: list with versions where relevant.
  3. Dev Commands: how to install, run the dev server, and build.
  4. Core Logic Summary: brief mention of the weight calculation.
  5. Key Constraints: things Claude must never change or assume.
  6. Additional Documentation: Direct links pointing to the specific domain files created in the `.claude/docs/` folder.

  <tone>
  Be technical. Be direct. No fluff. No marketing language.
  </tone>
```
