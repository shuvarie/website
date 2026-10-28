# shuvarie.org

The website for **Shuvarie** — an agentic AI coding agent that lives in your
terminal.

The site is a [SvelteKit](https://svelte.dev/docs/kit) app, fully prerendered to
static HTML and deployed to Cloudflare Pages. The docs are markdown compiled by
[mdsvex](https://mdsvex.pngwn.io) (Svelte's take on MDX), with every code block
highlighted by [Shiki](https://shiki.style) at build time.

## Stack

| Piece | What it does |
| --- | --- |
| SvelteKit 3 + Svelte 5 (runes) | routing, prerendering, hydration |
| `@sveltejs/adapter-static` | emits a static site into `build/` |
| Tailwind CSS v4 | design tokens in `src/app.css` (`@theme`), no config file |
| `mdsvex` | compiles `src/content/**/*.md` into Svelte components |
| `rehype-slug` + `rehype-autolink-headings` | heading ids and `#` anchors |
| `mdx-plugins.ts` | collects h2–h4 headings into frontmatter for the TOC |
| Shiki (`vitesse-dark`) | build-time syntax highlighting, zero JS shipped |

## Commands

```sh
pnpm install
pnpm dev        # dev server on http://localhost:5173
pnpm check      # svelte-check + TypeScript
pnpm build      # prerender everything into build/
pnpm preview    # serve build/ locally
```

## Layout

```
src/
  app.css                     design tokens + prose / terminal styling
  app.html                    document shell (fonts, color-scheme)
  content/
    about.md                  about page (markdown)
    docs/**/*.md              the manual — one page per file
  lib/
    docs.ts                   content collection: slugs, nav groups, prev/next
    components/               header, footer, search, TOC, terminal mock, …
  routes/
    +page.svelte              landing page
    docs/+layout.svelte       docs shell: sidebar, search, mobile drawer
    docs/+page.svelte         manual index
    docs/[...slug]/           one prerendered page per markdown file
    search.json/+server.ts    build-time search index
mdx-plugins.ts                rehype plugin feeding the TOC
vite.config.ts                mdsvex pipeline + Shiki highlighter
```

## Writing docs

Add a file under `src/content/docs/`. The slug comes from the path, so
`docs/usage/cli.md` becomes `/docs/usage/cli`. Frontmatter drives navigation:

```md
---
title: Command line & the prompt
description: "Invocation flags and headless mode."
group: Usage
order: 1
---
```

- `group` places the page in a sidebar section (`Getting started`, `Usage`,
  `Configuration`; anything else falls to the end).
- `order` sorts within the group.
- `headings` is filled in automatically — do not write it by hand.

### MDX

Every doc is a Svelte component, so you can import and use components directly:

```md
<script>
	import Aside from '#lib/components/Aside.svelte';
</script>

<Aside kind="tip" title="heads up">
	Callouts are real components, not HTML blobs.
</Aside>
```

Two rules that follow from that:

- `{` and `}` are live Svelte expressions — escape literal braces in prose as
  `&#123;` / `&#125;` (fenced code blocks are handled for you).
- Fenced blocks are highlighted at build time; the language must be one of the
  `LANGS` listed in `vite.config.ts`, otherwise it falls back to `text`.

## Deployment

`.github/workflows/deploy.yml` runs `pnpm check` and `pnpm build` on every push
to `main`, then publishes `build/` to Cloudflare Pages. Trailing slashes are off
(`trailingSlash = 'never'`), so canonical URLs look like `/docs/install`.
